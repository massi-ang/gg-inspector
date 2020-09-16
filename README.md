# gg-inspector - a CLI to inspect an AWS IoT Greengrass installation

This is a CLI that can help you in finding issues with your current AWS IoT Greengrass installation. Requires node 10.x or above.

It provides a `show` command to display the current group configuration and a `logs` command to tail all the logs.

To use, you can run

```
sudo su
npx @mirai73/gg-inspector show
```

or if you have cloned this repo locally:

```
sudo su
node index show
```
