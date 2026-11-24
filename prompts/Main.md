thr server .gitignore file looks like so:

```text
~\shepherd\server\.gitignore
```

```.gitignore
node_modules

trash

# Environment variables
.env
.env.*
!.env.example

logs/
*.log

coverage/
dist/
build/
```

but the ~\shepherd\server\.env.development file was not ignored during the commit
