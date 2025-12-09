# 负责转储博客文章的 PY 脚本
# 有负责初始化文章 UUID 的功能，如果不执行可能会出现分享链接失效的问题
# 每次构建的时候，如果文章没有 UUID 键，会生成一个新的，这时候旧的分享链接会失效
# 所以需要这个脚本中的 try_insert_uuid() 函数写回文件内

from pathlib import Path
from shutil import copy2, copytree, rmtree
from subprocess import run
import shortuuid
from ruamel.yaml import YAML
from ruamel.yaml.scalarstring import DoubleQuotedScalarString
import re
from typing import Any


def run_cmd(directory: str, cmd: str) -> str:
    return run(
        cmd,
        shell=True,
        cwd=directory,
        capture_output=True,
        text=True,
        encoding="utf-8",
    ).stdout


def try_insert_uuid(file_path: Path) -> None:
    with open(file_path, "r", encoding="utf-8") as f:
        yaml_head, context = re.findall(r"^---\n([\s\S]*?)\n---\n([\s\S]*)$", f.read())[
            0
        ]

        yaml = YAML()
        yaml.preserve_quotes = True
        yaml.allow_unicode = True

        head_data: dict[str, Any] = yaml.load(yaml_head)
        if head_data.get("uuid") == None:
            uuid = DoubleQuotedScalarString(shortuuid.uuid())
            head_data["uuid"] = uuid
            print(f"已为{file_path}补全 UUID：{uuid}")
    with open(file_path, "w", encoding="utf-8") as f:
        f.write("---\n")
        yaml.dump(head_data, f)
        f.write("---\n")
        f.write(context)


def clear_output(output_path: Path) -> None:
    for item in output_path.iterdir():
        if item.is_dir():
            rmtree(item)
            print(f"已删除输出文件夹中的目录 {item.name}")
        else:
            item.unlink()
            print(f"已删除输出文件夹中的文件 {item.name}")

def process_md_recursive(path: Path) -> None:
    for item in path.iterdir():
        if item.is_dir():
            if item.name in [".git", ".vscode"]:
                continue
            process_md_recursive(item)
        elif item.suffix == ".md":
            try_insert_uuid(item)


def copy_storage(storage_path: Path, output_path: Path) -> None:
    for item in storage_path.iterdir():
        destination = output_path / item.name
        if item.is_dir() and item.name not in [".vscode", ".git"]:
            copytree(item, destination)
            print(f"已复制文件夹 {item.name} 到输出文件夹")
        elif item.suffix == ".md":
            copy2(item, destination)
            print(f"已复制文件 {item.name} 到输出文件夹")


def main() -> None:
    storage_path = Path("D:/笔记/狼迹拾遗/")    # 你在本地存储文章的地方
    project_path = Path("D:/Project/Vue/read-wolf/")    # 项目根目录
    output_path = Path("D:/Project/Vue/read-wolf/posts/")   # 项目文章缓存文件夹

    process_md_recursive(storage_path)
    clear_output(output_path)
    copy_storage(storage_path, output_path)

    print("正在执行构建命令...")
    print(run_cmd(project_path, "pnpm launch"))


if __name__ == "__main__":
    main()