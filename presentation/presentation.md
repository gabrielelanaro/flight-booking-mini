---
marp: true
theme: default
paginate: true
---

<style>
.columns {
  display: flex;
  gap: 20px;
}
.column {
  flex: 1;
}
.column-centered {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;
}
</style>

# Cooking Class: How to Work with AI

## My Experience with AI-Assisted Development

<!-- Warm welcome, thank everyone for coming, frame talk as personal field report on building with AI assistants. -->


---

# About Me

<div class="columns">
  <div class="column">
<ul>
<li>Gabriele Lanaro, "Gabi"</li>
<li>Staff Engineer, Agent Builder Tooling @Parloa</li>
<li>Chemist -> MLE -> MLOps -> SWE</li>
<li>Hooked on AI in general and especially AI Driven Development</li>
<li>Newsletter (with Pedro Castillo): https://teamkitchen.substack.com/</li>

</ul>
  </div>
  <div class="column-centered">
    <img src="1757103512240.jpeg" alt="Presenter Photo">
  </div>
</div>

<!-- 
Tell about what the company is about and how long you were there, introduce the story how you got hooked into AI Driven Development
Share Parloa is a voice AI unicorn; describe airport agent example to paint picture; mention chemist-to-ML-to-SWE journey and newsletter with Pedro.
-->

---

# The Impact We Observed

- 60% increase in PR/week (one team measurement)
- Adoption has grown steadily since March
- Visible inner-sourcing effects across teams (lowers contrib barrier)

**Takeaway:** Momentum is real—teams ship faster with less friction.
**Bottom line:** It’s not black and white, but you can do things you couldn’t do before.

<!-- Recall leadership push, CursorMeister coding contest, and first pro TypeScript project shipped thanks to AI pairing. -->

---

# Our Journey Today

- **Choosing Your AI Partner:** Selecting the best model for your specific tasks.
- **Context Engineering:** Setting up AI for optimal performance.
- **Integrating AI into Workflows:** Making AI a seamless part of your daily routine.

<!-- Flag MCP teaser and invite audience to jot Q&A throughout so wrap-up is interactive. -->

---

# How to Interact with Autonomous AI Agents

**Key principle:** Let the agent act and self-verify in its environment

**Role of the Developer:**
- Set up the project/org context
- Establish feedback loops: make sure the agent can check its work
- Decide on the requirements and constraints/guidelines

**What the Agent Does:**
- Research and explore, provide options
- Write code, run tests, self-correct

<!-- Emphasize in the presentation that no coding is allowed
Reinforce gym metaphor, talk through tooling + verification loop story to show mindset shift. -->

---

# Picking Your Model

## Anthropic
* Claude Sonnet 4.5: Released yesterday, tops the benchmarks
* Claude Opus 4.1: Expensive, top-performance (OUTDATED)
* Claude Sonnet 4: Great model, for day-to-day task, over-eager (OUTDATED)

## OpenAI
* GPT-5-Codex: My Personal Favorite, inexpensive, top-performance.

## Notable Mentions
* GLM-4.6 (z-ai): (today) Similar to Sonnet but 6 euro/month
* Grok Code Fast (x-ai): Fast model for execution


<!-- Contrast Sonnet's eagerness with GPT-5-Codex's quieter style; call out Claude 4.5 launch yesterday and why benchmarks matter; share rubric (cost, reliability, behavior). -->

---

# Bootstrapping AGENTS.md/CLAUDE.md/Cursor Rules

**What to include:**
- Project structure and architecture patterns
- Coding standards and best practices
- Testing approaches and requirements
- Any type of workaround

**Metaphor**: Agent is a developer starting from scratch every new session

<!-- Share Parloa playbook: hand agents architecture map, rules, org docs; stress "agent as new hire" mindset. -->

---

# The Plan-Act Workflow (How to Cook)

## Plan Phase
- ALWAYS Ask the agent to plan the change
- Guide the agent by asking to gather context
- Limit the scope by being specific: "focus on the e2e tests only"

## Act Phase
- Implement the planned solution
- Iterate based on feedback and testing results

**Tip**: Do not be afraid to start over

<!-- 
Prompt:

In the current repository, we have a stub implementation for a flight booking API and I want to implement a simple in-memory solution, focus only on the e2e tests -- we will add the rest of the tests later.

Present a step by step implementation plan.
-->

<!-- Cue them to watch agent gather repo context, plan, execute; highlight that crisp requirements are the new coding superpower. -->

---

# PR Preparation

- automate your PR and Ticket creation
- use pre-commit hooks/pre-push hooks to establish feedback cycle
- use commands to create issues and PRs, so you can have automation end 2 end

<!-- Tie back to Parloa story: AI-generated PRs lowered contribution barrier; mention devs tagging AI PRs to study impact. -->

---

# Review Process

- Set up coding review bots (Bugbot, codex)
- CAREFULLY review the code, the agents will make very subtle mistakes
- Leave comment in PRs, and address them using the agent

<!-- Call back to measurement challenge: tagging AI PRs, no perfect A/B but trust+verify mindset. -->


---

# MCP Ranked List

- **notion**: Fetch documentation, tech specs and any context.
- **jira**: Create tickets, but has not been reliable
- **context7**: Fetch up-to date documentation snippets
- **chrome-dev-tools**: Use the browser, screenshots & frontend feedback loops.

<!-- Segue: as more things got automated integration became important, those are my top picks; -->

---

# Enter the Rabbit Hole

- Sub-agents for complex multi-step tasks
- Background Agents in Slack
- Spec Driven Development https://github.com/github/spec-kit
- BMAD Method https://github.com/bmad-code-org/BMAD-METHOD

---

# Key Takeaways

**Don't sleep on AI**

**For your daily workflow:**
- Use Plan/Act approach, iterate extensively on the plan
- Create comprehensive AGENTS.md files for consistent agent behavior
- Build feedback loops for the agent to self-check its work
- REVIEW, for real


---

# Stay Updated

**Questions?**
Let's discuss your specific use cases and challenges!

**Keep in Touch:**
- LinkedIn: [linkedin.com/in/gabrielelanaro](linkedin.com/in/gabrielelanaro)
- Newsletter: [teamkitchen.substack.com](https://teamkitchen.substack.com/)
