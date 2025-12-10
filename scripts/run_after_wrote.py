# 负责更新仓库的 PY 脚本
# 同样具有校验 UUID 是否存在的功能

from pathlib import Path
import shortuuid
from ruamel.yaml import YAML
from ruamel.yaml.scalarstring import DoubleQuotedScalarString, ScalarString
import re
from typing import Any
from git import Repo
import datetime


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


def changed_updated_time(file_path: Path) -> None:
    with open(file_path, "r", encoding="utf-8") as f:
        yaml_head, context = re.findall(r"^---\n([\s\S]*?)\n---\n([\s\S]*)$", f.read())[
            0
        ]

        yaml = YAML()
        yaml.preserve_quotes = True
        yaml.allow_unicode = True

        head_data: dict[str, Any] = yaml.load(yaml_head)
        updated_date = datetime.date.today()
        # 必须用 datetime 对象，这是唯一可以让它不自带引号的解决方案
        head_data["updatedDate"] = updated_date
        
        print(f"已更新{file_path}的时间为：{updated_date}")
    with open(file_path, "w", encoding="utf-8") as f:
        f.write("---\n")
        yaml.dump(head_data, f)
        f.write("---\n")
        f.write(context)


def process_md_recursive(path: Path) -> None:
    for item in path.iterdir():
        if item.is_dir():
            if item.name in [".git", ".vscode"]:
                continue
            process_md_recursive(item)
        elif item.suffix == ".md":
            try_insert_uuid(item)


def update_repo(path: Path) -> None:
    repo = Repo(path)
    repo.git.add("-A")
    repo.index.commit(datetime.date.today().strftime("%Y-%m-%d"))
    print("已暂存和提交所有文章更改")
    del repo  # 不加会弹错误


def get_updated_file_paths(path: Path) -> list[Path]:
    repo = Repo(path)
    return [Path(x.a_path) for x in repo.index.diff(None)]


def main() -> None:
    storage_path = Path("D:/笔记/狼迹拾遗/")  # 你在本地存储文章的地方

    process_md_recursive(storage_path)
    updated_file_paths = [
        path for path in get_updated_file_paths(storage_path) if path.suffix == ".md"
    ]
    for file_path in updated_file_paths:
        changed_updated_time(storage_path.joinpath(file_path))

    if updated_file_paths:
        update_repo(storage_path)
    else:
        print("什么也没发生")


if __name__ == "__main__":
    main()
