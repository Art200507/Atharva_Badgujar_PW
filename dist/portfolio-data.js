window.PORTFOLIO = {
  "cards": {
    "wn4ss-project": {
      "id": "wn4ss-project",
      "title": "WN4SS ML Pipeline — IEEE TMLCN (Under Review)",
      "meta": "Python · PyTorch · XGBoost · LightGBM · scikit-learn · SLURM/HPC",
      "description": "Predicts cellular signal strength from weather and network measurements on a live LTE network. The five-model pipeline achieved 1.83 dB mean absolute error and generalized to a new city without retraining.",
      "bullets": [
        "Predicts cellular RSRP from weather and network KPI features on a live CBRS LTE network.",
        "Compares PyTorch MLP, XGBoost, LightGBM, Random Forest, and LinearSVR using five-fold cross-validation.",
        "Achieved MAE of 1.83 dB; cross-city evaluation in Elmira, NY achieved MAE of 2.21 dB with zero retraining.",
        "First author on a manuscript under review at IEEE Transactions on Machine Learning in Communications and Networking. Manuscript ID: TMLCN-11-26-0378."
      ],
      "dates": null
    },
    "gprop-project": {
      "id": "gprop-project",
      "title": "gprop ML Correction Layer",
      "meta": "Python · NumPy · Ray-tracing simulation",
      "description": "Adds a machine-learning correction layer to a ray-tracing model of radio propagation. It learns from 33-column simulation outputs to improve predictions of real-world signal strength.",
      "bullets": [
        "ML correction layer trained on 33-column heatmap feature outputs from gprop, an RF propagation digital twin.",
        "Updated the geometry pipeline to represent buildings and trees as plane clusters; 25 tests passed.",
        "Verified the complete preprocessing → simulation → heatmap pipeline.",
        "Co-authorship planned on the resulting paper; submission estimated February 2027."
      ],
      "dates": null
    },
    "qcnn": {
      "id": "qcnn",
      "title": "Independent Quantum Convolutional Neural Network Research",
      "meta": "Python · Qiskit · NumPy · SciPy · SQLite",
      "description": "Independent research compares quantum neural networks and quantum convolutional models with classical deep learning. A reproducible 73-cycle pipeline evaluated 5,120 fresh simulated cases and measured a 3.95 percentage-point gain on a constrained prediction task.",
      "bullets": [
        "Self-directed research investigating the practical effectiveness of Quantum Neural Networks (QNNs) and Quantum Convolutional Neural Networks (QCNNs) versus classical deep learning models.",
        "Designed a fully reproducible research pipeline with 73 documented experimental cycles, predeclared statistical criteria, immutable result logging, and source-hash verification.",
        "Evaluated quantum measurement protocols across 5,120 fresh simulated cases, confirming a 3.95 percentage-point improvement in a constrained prediction task (81.9% vs. 78.0%).",
        "Implemented and verified a seven-qubit QCNN observable supported by 33 scientific tests and independent circuit comparisons.",
        "Built a 537-document retrieval system with 72,622 indexed chunks to systematically survey the quantum-ML literature."
      ],
      "dates": null
    },
    "tailr": {
      "id": "tailr",
      "title": "Tailr — Local-First Career Platform",
      "meta": "Next.js 16 · React 19 · TypeScript · Drizzle · Postgres · Docker",
      "description": "A local-first platform for managing résumés and job applications, with encrypted browser storage. It combines sandboxed PDF generation with a browser extension that fills job applications.",
      "bullets": [
        "IndexedDB storage with AES-256-GCM encryption and 600,000-iteration PBKDF2.",
        "LaTeX-to-PDF compilation runs inside a bubblewrap Linux namespace sandbox with a 128 MB heap cap.",
        "Manifest V3 Chrome extension for job autofill.",
        "Validated with a 69-case Playwright end-to-end suite."
      ],
      "dates": null
    },
    "proximity": {
      "id": "proximity",
      "title": "Proximity — Student Social Platform",
      "meta": "React · Vite · PHP · MySQL",
      "description": "A social and networking platform built for students. Profiles, friend recommendations, and notifications help users discover and connect with one another.",
      "bullets": [
        "Student-focused social and networking platform.",
        "Includes profiles, friend recommendations, and notifications."
      ],
      "dates": null
    },
    "shadowdevice": {
      "id": "shadowdevice",
      "title": "ShadowDevice (MobileVM)",
      "meta": "Go · AES-GCM · HTTP",
      "description": "An encrypted disk-snapshot prototype for storing and reading device data. Authenticated manifests and incremental uploads support both local and HTTP-based access.",
      "bullets": [
        "Encrypted disk snapshot prototype using AES-GCM.",
        "Includes authenticated manifests and incremental uploads.",
        "Supports local or HTTP reads."
      ],
      "dates": null
    },
    "verbatim": {
      "id": "verbatim",
      "title": "Verbatim",
      "meta": "Python · faster-whisper · pyannote.audio · sentence-transformers · PyTorch · SQLite · Anthropic API",
      "description": "Turns audio into searchable transcripts with speaker labels. Users can search conversations by meaning, retrieve exact quotes, and review daily digests.",
      "bullets": [
        "Local audio-to-transcript pipeline for semantic conversation search and verbatim quote retrieval.",
        "Speaker diarization with pyannote.audio and transcription with faster-whisper.",
        "Uses embeddings, SQLite storage, and daily digests."
      ],
      "dates": null
    },
    "podcast": {
      "id": "podcast",
      "title": "AI Podcast Pipeline",
      "meta": "Python · FastAPI · React · Tailwind CSS · SQLite · Groq/Gemini · Podbean",
      "description": "Automates the steps from choosing a podcast topic to generating and publishing an episode. A management dashboard brings the workflow into one place.",
      "bullets": [
        "Automates podcast topic selection, episode generation, and publishing.",
        "Includes a management dashboard.",
        "Uses Groq/Gemini for generation and Podbean for publishing."
      ],
      "dates": null
    },
    "veridica": {
      "id": "veridica",
      "title": "VERIDICA",
      "meta": "React · Vite · Tailwind CSS · Node.js · Express · Perplexity API",
      "description": "An AI-assisted app for examining potentially false news through a chat interface. It saves analysis history and includes caching, rate limits, and input validation.",
      "bullets": [
        "AI-assisted fake news detection app with a chat interface.",
        "Saved analysis history and caching.",
        "Rate limiting and input validation."
      ],
      "dates": null
    },
    "crius07": {
      "id": "crius07",
      "title": "Crius07",
      "meta": "JavaScript · Chrome/Edge Extensions API · Gemini API",
      "description": "A browser extension that uses a screenshot of the current page as context. It answers questions about the page with step-by-step explanations.",
      "bullets": [
        "Captures screenshots of the current browser page.",
        "Uses Gemini to answer contextual questions step by step.",
        "Built for Chrome and Edge."
      ],
      "dates": null
    },
    "middleman-project": {
      "id": "middleman-project",
      "title": "The Middle Man",
      "meta": "Next.js · React · Tailwind CSS · Firebase · MySQL · Stripe",
      "description": "A digital escrow platform for transactions between buyers and sellers. Payment processing, authentication, transaction tracking, and fraud detection support the exchange.",
      "bullets": [
        "Digital escrow platform for buyer-seller transactions.",
        "Payment processing through Stripe.",
        "Authentication, transaction tracking, and fraud detection."
      ],
      "dates": null
    },
    "schema-project": {
      "id": "schema-project",
      "title": "SchemaMorph",
      "meta": "Python · Flask · React · Three.js · Pandas · openpyxl",
      "description": "A faculty-data comparison and ETL tool built for DEI research at UB SEAS. It identifies changes between datasets, validates schemas, and exports results to Excel while handling datasets up to 5 GB.",
      "bullets": [
        "Built to solve preprocessing bottlenecks in DEI research at UB SEAS.",
        "Compares faculty datasets, identifies changes, and exports to Excel.",
        "Dynamic rule-building and schema validation for datasets up to 5 GB.",
        "Adopted across multiple active UB research pipelines."
      ],
      "dates": null
    },
    "insightlens": {
      "id": "insightlens",
      "title": "InsightLens",
      "meta": "Python · Pandas · NumPy · scikit-learn · PyTorch · SQLite · Plotly",
      "description": "An e-commerce analytics pipeline that turns raw data into business dashboards. It combines data cleaning, customer segmentation, and predictive modeling to make patterns easier to explore.",
      "bullets": [
        "E-commerce analytics pipeline covering data cleaning and customer segmentation.",
        "Predictive modeling with scikit-learn and PyTorch.",
        "Interactive business dashboards built with Plotly."
      ],
      "dates": null
    },
    "mindmirror-project": {
      "id": "mindmirror-project",
      "title": "MindMirror",
      "meta": "HTML · JavaScript · MorphCast SDK · Spotify API",
      "description": "A browser-based app that uses facial analysis to detect emotion and recommend music by mood. It connects MorphCast’s real-time analysis with Spotify recommendations.",
      "bullets": [
        "Browser-based emotion detection using real-time facial analysis.",
        "MorphCast SDK for facial analysis.",
        "Spotify API for mood-based music recommendations."
      ],
      "dates": null
    },
    "interchat": {
      "id": "interchat",
      "title": "interChat",
      "meta": "JavaScript · HTML · CSS · Chrome Extensions API",
      "description": "A Chrome extension for asking follow-up questions about Claude AI responses. Questions stay inline with the response so the surrounding context remains close at hand.",
      "bullets": [
        "Chrome extension for contextual follow-up questions about Claude AI responses.",
        "Supports an inline question-and-answer interaction."
      ],
      "dates": null
    },
    "wn4ss-role": {
      "id": "wn4ss-role",
      "title": "Undergraduate Researcher — WN4SS Lab",
      "meta": "University at Buffalo",
      "description": "Builds machine-learning pipelines that predict cellular signal strength from weather and network data. The work achieved 1.83 dB error and supports a first-author manuscript currently under review at IEEE TMLCN.",
      "bullets": [
        "Supervisor: Prof. Filippo Malandra, Department of Computer Science & Engineering.",
        "Built a five-model pipeline using PyTorch MLP, XGBoost, LightGBM, Random Forest, and LinearSVR on a live CBRS LTE network.",
        "Achieved MAE of 1.83 dB and cross-city MAE of 2.21 dB in Elmira, NY with zero retraining.",
        "First author on a manuscript under review at IEEE Transactions on Machine Learning in Communications and Networking; ID: TMLCN-11-26-0378.",
        "Collaborating with Kishor Kumar on the dataset pipeline and model evaluation."
      ],
      "dates": "Jan 2025 – Present"
    },
    "gprop-role": {
      "id": "gprop-role",
      "title": "gprop Research Collaboration — Co-Author",
      "meta": "WN4SS Lab · University at Buffalo",
      "description": "Develops a machine-learning correction layer for an RF propagation simulator. The collaboration also unified building and tree geometry and verified the full simulation pipeline.",
      "bullets": [
        "Collaborator: Bob French, MS Candidate, UB ECE.",
        "Developing an ML correction layer trained on 33-column heatmap features to improve real-world signal predictions.",
        "Updated gprop’s geometry pipeline to represent buildings and trees as plane clusters; 25 tests passed.",
        "Verified the complete preprocessing → simulation → heatmap pipeline.",
        "Will be listed as co-author on the resulting paper; submission estimated February 2027."
      ],
      "dates": "2025 – Present"
    },
    "daretocare": {
      "id": "daretocare",
      "title": "Research Data Analyst Intern — DAREtoCARE Lab",
      "meta": "UB School of Engineering & Applied Sciences",
      "description": "Analyzed more than one million institutional records to study equity and inclusion across STEM departments. Automated workflows cut manual processing by 70%, while SchemaMorph helped research teams prepare and compare large datasets.",
      "bullets": [
        "Supervisor: Dr. Matilde Sánchez-Peña, Assistant Professor of Engineering Education.",
        "Processed 1M+ institutional records using Python, Pandas, and SQL.",
        "Applied clustering and predictive modeling to identify KPIs for faculty advancement and underrepresented student outcomes.",
        "Automated data workflows, reducing manual processing time by 70%.",
        "Built SchemaMorph, a Python/Flask ETL tool with dynamic rules and schema validation for datasets up to 5 GB, adopted across multiple active UB research pipelines."
      ],
      "dates": "Dec 2024 – Sep 2025"
    },
    "seas": {
      "id": "seas",
      "title": "Data Analytics Intern — SEAS",
      "meta": "UB School of Engineering & Applied Sciences",
      "description": "Completed a summer internship focused on applied data analytics in UB’s engineering school. The role took place between sophomore and junior year.",
      "bullets": [
        "Summer internship focused on applied data analytics within the engineering school ecosystem.",
        "Completed between sophomore and junior year."
      ],
      "dates": "Summer · Between sophomore and junior year"
    },
    "ta": {
      "id": "ta",
      "title": "Teaching Assistant — Computer Science & Engineering",
      "meta": "University at Buffalo",
      "description": "Supports students through assignment feedback and weekly office hours on debugging, data structures, and system design. Graded over 500 assignments and helped refine rubrics and redesign two assignments.",
      "bullets": [
        "Graded 500+ assignments with detailed written feedback on code quality, efficiency, and algorithmic correctness.",
        "Held weekly office hours supporting 60+ students on debugging, data structures, and system design.",
        "Collaborated with instructors on rubric refinement; contributed to two assignment redesigns adopted the following semester."
      ],
      "dates": "Sep 2024 – Present"
    },
    "tass": {
      "id": "tass",
      "title": "TASS Tutor — Computer Science & Mathematics",
      "meta": "University at Buffalo",
      "description": "Tutored students in computer science and mathematics through UB’s Tutor Assisted Study Sessions program. One-on-one and group sessions focused on foundational concepts and mathematical problem-solving.",
      "bullets": [
        "Provided one-on-one and group tutoring in Computer Science and Mathematics through UB’s TASS program.",
        "Helped students work through foundational CS concepts and mathematical problem-solving."
      ],
      "dates": "Freshman Year"
    },
    "rha": {
      "id": "rha",
      "title": "Coordinator of Communications — RHA UB",
      "meta": "Residence Hall Association · University at Buffalo",
      "description": "Led communications for UB’s Residence Hall Association. Managed announcements, messaging, and outreach across residence hall communities.",
      "bullets": [
        "Served as communications lead for UB’s Residence Hall Association.",
        "Managed announcements, messaging, and outreach across residence hall communities."
      ],
      "dates": "Freshman Year"
    },
    "nrhh": {
      "id": "nrhh",
      "title": "Vice President of Membership — NRHH UB",
      "meta": "National Residence Hall Honorary · University at Buffalo",
      "description": "Led membership recruitment and engagement for UB’s National Residence Hall Honorary chapter. Organized recognition initiatives and supported chapter growth.",
      "bullets": [
        "Led membership recruitment and engagement for UB’s NRHH chapter.",
        "Organized recognition initiatives and drove chapter growth."
      ],
      "dates": "Sophomore Year"
    },
    "engagement": {
      "id": "engagement",
      "title": "Student Engagement Ambassador",
      "meta": "Office of Student Engagement · University at Buffalo",
      "description": "Represented the Office of Student Engagement at campus events and initiatives. Helped students connect with campus organizations and resources.",
      "bullets": [
        "Represented the Office of Student Engagement at campus events and initiatives.",
        "Helped connect students with campus organizations and resources."
      ],
      "dates": "Sophomore Year"
    },
    "integrity": {
      "id": "integrity",
      "title": "Student Integrity Ambassador",
      "meta": "Office of Student Integrity · University at Buffalo",
      "description": "Promoted academic integrity and ethical conduct across UB’s student community. Took part in outreach, education programs, and integrity initiatives.",
      "bullets": [
        "Promoted academic integrity and ethical conduct across the UB student community.",
        "Participated in outreach, education programs, and integrity initiatives."
      ],
      "dates": "Sophomore Year"
    },
    "incodevision": {
      "id": "incodevision",
      "title": "Data Science Intern",
      "meta": "Incodevision",
      "description": "Held a data science internship at Incodevision. Project responsibilities and outcomes are awaiting additional résumé details.",
      "bullets": [
        "Data Science Intern at Incodevision."
      ],
      "dates": null
    },
    "rag": {
      "id": "rag",
      "title": "RAG Assistant",
      "meta": "Retrieval-augmented generation · Medical information",
      "description": "A retrieval-augmented assistant that helps people with ADHD find and understand medical information. It uses a medical reference collection to make relevant information more accessible, especially when cost limits access to support.",
      "bullets": [
        "Retrieval-augmented assistant focused on medical information for people with ADHD.",
        "Uses a collection of medical reference material to provide context for responses.",
        "Designed with accessibility and the cost barriers to support in mind."
      ],
      "dates": null
    },
    "bonvoyage": {
      "id": "bonvoyage",
      "title": "BonVoyage",
      "meta": "AI-powered travel planning",
      "description": "An AI-powered travel planner for exploring and organizing trips. It helps travelers turn a trip idea into a plan.",
      "bullets": [
        "AI-powered travel planner.",
        "Helps users explore and organize trip plans."
      ],
      "dates": null
    }
  },
  "rows": {
    "research-projects": {
      "title": "Research Projects",
      "label": "EXPLORE THE COLLECTION",
      "ids": [
        "wn4ss-project",
        "gprop-project",
        "qcnn"
      ]
    },
    "personal-projects": {
      "title": "Personal Projects",
      "label": "EXPLORE THE COLLECTION",
      "ids": [
        "middleman-project",
        "mindmirror-project",
        "schema-project",
        "tailr",
        "proximity",
        "shadowdevice",
        "verbatim",
        "podcast",
        "veridica",
        "crius07",
        "insightlens",
        "interchat",
        "rag",
        "bonvoyage"
      ]
    },
    "research-experience": {
      "title": "Research & Professional Experience",
      "label": "EXPLORE THE COLLECTION",
      "ids": [
        "wn4ss-role",
        "gprop-role",
        "daretocare",
        "seas"
      ]
    },
    "general-experience": {
      "title": "Teaching & General Experience",
      "label": "EXPLORE THE COLLECTION",
      "ids": [
        "ta",
        "tass",
        "incodevision"
      ]
    },
    "leadership-experience": {
      "title": "Leadership Experience",
      "label": "EXPLORE THE COLLECTION",
      "ids": [
        "rha",
        "nrhh",
        "engagement",
        "integrity"
      ]
    }
  }
};
