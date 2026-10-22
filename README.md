# iGauchoBack

**Your degree, mapped.**

iGauchoBack is a mobile-friendly degree-planning platform that turns university requirements into searchable major guides and interactive prerequisite maps. It brings roadmaps, course information, grade data, planning tools, and campus community features into one place.

[Open the production app](https://igauchoback.vercel.app/) · [Explore majors](https://igauchoback.vercel.app/explore)

> iGauchoBack is an independent advising aid. It is not affiliated with, endorsed by, or a replacement for an official university catalog, degree audit, or academic advisor. Always confirm requirements with the relevant institution.

## Project status

iGauchoBack is deployed and actively developed.

- **UC Santa Barbara:** broad undergraduate coverage, selected graduate roadmaps, course search, and grade-distribution tools
- **UCLA:** early engineering preview
- **UC Berkeley:** early engineering preview
- **Local development:** works immediately from versioned JSON data
- **Connected mode:** optional Supabase-backed authentication, contributions, community features, and collaborative planning

Coverage varies by school and program. A listed major may have a requirements guide before it has a complete interactive graph.

## What the app does

### Explore programs

- Search and filter majors across supported campuses
- Browse by school, college, department, degree type, or interest
- Compare two majors and inspect shared preparation or career outcomes
- Share filterable URLs with other students

### Understand degree paths

- Visualize prerequisites and recommended course sequences
- Inspect course details, units, resources, and related career paths
- Highlight prerequisite conflicts, critical paths, and bottleneck courses
- Test “what if” changes without modifying source roadmap data

### Plan progress

- Mark courses as planned or completed
- Import a transcript PDF and match completed courses to a roadmap
- Apply AP and transfer-credit rules where supported
- Use collaborative planning features when the optional backend is enabled

### Research courses

- Search the UCSB course catalog
- Review historical grade distributions and instructor offerings
- Explore General Education areas and course-level trends
- Browse undergraduate and graduate program information

### Participate

- Submit roadmap improvements for review
- Ask and answer campus-specific questions
- Share course reviews and alumni outcomes
- Vote on community roadmap submissions

## How it is built

| Layer | Technology | Responsibility |
| --- | --- | --- |
| Web application | Next.js 14, React 18, TypeScript | App Router pages, server rendering, route handlers, and client interactions |
| Interface | Tailwind CSS | Responsive layouts, themes, and accessible interaction states |
| Roadmap visualization | React Flow | Interactive course, prerequisite, and career graphs |
| Default data | Versioned JSON | School catalogs, requirements, roadmaps, curriculum snapshots, and grade summaries |
| Optional backend | Supabase | Authentication, community content, roadmap submissions, and shared plans |
| Optional rate limiting | Upstash Redis | Abuse protection for public API routes |
| Optional transcript fallback | Vercel AI Gateway | Structured extraction when deterministic PDF parsing is insufficient |
| Observability | Sentry | Production error reporting |
| Hosting | Vercel | Preview and production deployments |

The application is intentionally useful without external services. When Supabase is not configured, public catalogs and seed roadmaps continue to work while account-dependent write features remain disabled.

## Repository structure

```text
.
├── README.md                 # Repository overview
└── acadmap/                  # Next.js application
    ├── app/                  # Pages, layouts, and API route handlers
    ├── components/           # Shared UI and feature components
    ├── data/                 # Versioned catalogs, roadmaps, and snapshots
    ├── docs/                 # Architecture and operations documentation
    ├── lib/                  # Domain logic, integrations, and data access
    ├── scripts/              # Data import, generation, and validation tools
    ├── supabase/             # Database schema and migrations
    └── tests/                # Planner and transcript tests
```

## Run locally

### Requirements

- Node.js 20 LTS recommended
- npm

### Start the application

```bash
git clone https://github.com/huynguyen9999/iGauchoBack.git
cd iGauchoBack/acadmap
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

No credentials are required for the default JSON-backed experience.

## Configuration

Copy the example file only if you need connected features:

```bash
cp .env.example .env.local
```

| Capability | Configuration | Notes |
| --- | --- | --- |
| Authentication and community data | `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Enables sign-in and Supabase-backed features |
| Server-side Supabase operations | `SUPABASE_SERVICE_ROLE_KEY` | Secret; server-side only |
| OAuth redirects | `NEXT_PUBLIC_SITE_URL` | Use the public origin for deployed environments |
| Rate limiting | `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` | Optional in local development |
| Error reporting | `SENTRY_DSN`, `NEXT_PUBLIC_SENTRY_DSN` | Optional |
| Transcript AI fallback | `AI_GATEWAY_API_KEY` | Optional; deterministic parsing runs first |
| Collaborative planner | `ENABLE_PLANNER_COLLAB=true` | Requires the supporting database configuration |
| Live UCSB curriculum data | `UCSB_API_KEY`, `USE_OFFICIAL_UCSB_CONNECTOR=true` | Optional connector |

Never commit `.env.local`, service-role keys, access tokens, OAuth client secrets, or provider credentials. Variables prefixed with `NEXT_PUBLIC_` are included in browser-visible application code and must not contain secrets.

See [`acadmap/.env.example`](./acadmap/.env.example) for the supported development variables.

## Quality checks

Run these commands from `acadmap/`:

```bash
npm run lint
npx tsc --noEmit
npm run test:planner
npm run test:transcript
npm run build
```

The planner and transcript suites use Node's built-in test runner. A successful production build also performs Next.js linting and type validation.

## Data and roadmap contributions

Most public academic content is stored as reviewable JSON rather than embedded in UI components. This keeps source attribution, program details, and graph data separate from presentation code.

When contributing academic data:

1. Use an official catalog, department page, or published curriculum document as the primary source.
2. Record the source URL and applicable catalog year where the schema supports it.
3. Keep uncertain recommendations separate from official requirements.
4. Run the relevant validation script before opening a pull request.
5. Treat generated output as a draft until it has been checked against the source.

Useful references:

- [`acadmap/docs/GEAR-25-26.md`](./acadmap/docs/GEAR-25-26.md) — UCSB Engineering curriculum sources
- [`acadmap/docs/UCSB-CURRICULUM.md`](./acadmap/docs/UCSB-CURRICULUM.md) — curriculum snapshots and connector behavior
- [`acadmap/docs/TRANSCRIPT-PARSING.md`](./acadmap/docs/TRANSCRIPT-PARSING.md) — transcript parsing pipeline
- [`acadmap/docs/PLANNER-ARCHITECTURE.md`](./acadmap/docs/PLANNER-ARCHITECTURE.md) — planner domain model and collaboration design

## API overview

The Next.js application exposes route handlers for:

- approved roadmap and school data
- course, grade, and General Education queries
- transcript-to-roadmap matching
- authenticated roadmap submissions and voting
- community content and shared plans when Supabase is configured

Public read routes are designed to work with the repository's versioned seed data. Write routes validate authentication and depend on the configured backend. See the handlers under [`acadmap/app/api`](./acadmap/app/api) for request and response contracts.

## Privacy and security notes

- Transcript responses use `Cache-Control: no-store`; uploaded files are processed for the request rather than written to the repository.
- If AI fallback is enabled, extracted transcript text may be sent to the configured model provider. Deployers should review that provider's data-handling terms before enabling it.
- Server-only credentials must never use the `NEXT_PUBLIC_` prefix.
- Roadmap submissions and community writes require authentication when the backend is enabled.
- Rate limiting and production error reporting are optional integrations and should be configured before operating a public write-enabled deployment.

Security-sensitive implementation details and live credentials do not belong in issues, pull requests, screenshots, or documentation.

## Deployment

The production application is deployed on Vercel from this repository.

For a new Vercel project:

1. Import the repository.
2. Set the project root directory to `acadmap`.
3. Use the detected Next.js build settings.
4. Add only the environment variables needed for the enabled features.
5. Deploy previews from pull requests and promote reviewed changes through `main`.

Operational guidance is available in [`acadmap/docs/PRODUCTION-OPS.md`](./acadmap/docs/PRODUCTION-OPS.md). Keep provider-specific identifiers and credentials in the deployment platform, not in the repository.

## Contributing

Focused pull requests are easiest to review. Include:

- a clear description of the user-facing or data change
- source links for academic-content updates
- screenshots for meaningful interface changes
- the checks you ran locally
- any known coverage limitations or follow-up work

Before submitting, confirm that the application still works without optional credentials unless your change explicitly targets a connected feature.
