---
description: "Explain Ralph Wiggum technique and available commands"
---

# Ralph Wiggum Plugin Help

Please explain the following to the user:

## What is the Ralph Wiggum Technique?

The Ralph Wiggum technique is an iterative development methodology based on continuous AI loops, pioneered by Geoffrey Huntley.

**Core concept:** The same prompt is fed to Claude repeatedly. Each iteration sees its own previous work in files and git history, iteratively improving until completion.

## Available Commands

### /ralph-loop <PROMPT> [OPTIONS]
Start a Ralph loop. Options: --max-iterations <n>, --completion-promise <text>

### /cancel-ralph
Cancel an active Ralph loop.