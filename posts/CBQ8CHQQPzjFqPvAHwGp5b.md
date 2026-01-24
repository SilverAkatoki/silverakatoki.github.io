# Github 改名后

我的 Github 用户名 原本是**SilverAkatoki**，后半部分「晓」实际上是拼错的片假名，所以我找了个机会改成了现在这个正确的版本。
别问我为什么不用现在网站里的那个，很显然一个 2016 年的死账号不让我这么做。*占着茅坑不拉屎什么的，真是讨厌啊*

下面收录了几个你需要更改的地方。

## 涉及 Github Pages 的页面重定向

如果你的仓库（或是源码、文档、Readme 等）里面有 **Github Page 的链接**（一般作为项目展示或是在线文档），最好把 URL 换成**新用户名的版本**。

## 本地仓库提交提示更新

因为名字改了，所以提交签名也得改。

用这个去更改你的提交上显示的名字：

```bash
git config --global user.name <你的新名字>
```

省略掉后面 `<你的新名字>` 这个参数，这就是打印当前名字的命令。

同理，邮箱也可以改或是查看：

```bash
git config --global user.email <你的新邮箱>
```

在这里，只是改名的话，邮箱是不会变的，Github 使用的是**邮箱**来辨别用户，所以在在线上看到的提交名字会自动变成新的。
本地没有那么智能，所以还是得改一下的。

## 本地远程仓库关联更新

这个比较繁琐，因为用户名变了，所以所有涉及远程仓库 URL 的地方都得改，要不然就找不到远程仓库了。

可以用这条命令手动更改远程关联：

```bash
git remote set-url origin <新的远程仓库 URL>
```

如果要反复操作的话，下面有个 Python 脚本可以帮到你。
它会找到运行位置原本关联的仓库 URL，然后**把用户名替换成新的**再重新关联：

```python
import subprocess


def main():
    new_name = "aaa"    # 改这里就好了

    remote_url = (
        subprocess.check_output(
            ["git", "remote", "get-url", "origin"], stderr=subprocess.STDOUT
        )
        .decode("utf-8")
        .strip()
    )

    repo_name = remote_url.split("/")[-1]
    if repo_name.endswith(".git"):
        repo_name = repo_name[:-4]

    new_url = f"https://github.com/{new_name}/{repo_name}.git"

    subprocess.run(["git", "remote", "set-url", "origin", new_url], check=True)


if __name__ == "__main__":
    main()

```

## 其他涉及到仓库 URL / Github 用户名的地方

这就因人而异喽。
我的是 `gh-pages` 这个 npm 包自动上传里填的 URL 要改。
