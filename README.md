# LLM Wiki & Visualization Harness

본 프로젝트는 지식베이스(raw 파일)를 LLM 에이전트가 자율적으로 마크다운 위키로 컴파일하고, 이를 미려한 UI와 지식 그래프로 시각화해 주는 **통합 실행 가능 제품**입니다. 하드코딩된 챗봇이 아닌, 파일 시스템을 감지하여 에이전트를 트리거(Hook)하는 진정한 에이전틱 하네스를 구현했습니다.

![Demo Screenshot](./demo/preview.png)

---

## 🚀 빠른 시작 가이드 (30분 완성)

누구나 자신의 자료 1건만으로 첫 위키 페이지와 지식망을 구축할 수 있습니다.

### 1. 환경 설정 및 의존성 설치
**사전 요구사항:** Node.js (v18+), Python (3.10+)

1. 레포지토리 클론 후 이동
```bash
git clone https://github.com/psangha123/Assignment3.git
cd Assignment3
```

2. 백엔드 및 MCP 서버 설치
```bash
cd tools/server
npm install
```

3. 프론트엔드 (뷰어) 설치
```bash
cd ../../viewer
npm install
```

### 2. 서버 실행 (One-Click Start)
편의를 위해 모든 컴포넌트(백엔드, 프론트엔드, 감시기)를 한 번에 실행할 수 있는 스크립트를 제공합니다.

**Windows 사용자:**
프로젝트 루트 폴더에서 `start.bat` 파일을 더블클릭하거나 터미널에서 실행합니다.
```cmd
start.bat
```
*(자동으로 3개의 새 터미널 창이 열리며 모든 서버가 가동됩니다.)*

**Mac/Linux 사용자:**
```bash
chmod +x start.sh
./start.sh
```

*(기본 5173 포트에서 미려한 Glassmorphism UI 뷰어가 열립니다.)*

---

## 🧠 에이전트 투입 및 통합 요청 방법

이 시스템은 API 키를 하드코딩하지 않습니다. 대신 사용자가 보유한 **IDE LLM Agent (Cline, Roo, Antigravity 등)**를 활성화하여 작업을 지시합니다.

1. **감시기(Watcher) 실행:**
루트 폴더에서 에이전트 감시 스크립트를 실행해 둡니다.
```bash
python watcher.py
```
2. **자료 투입 (Data Input):**
`raw/` 폴더에 가지고 계신 원본 자료(예: `.txt` 파일) 1개를 복사하여 넣습니다.
3. **통합 요청 (Integration):**
`watcher.py`가 새 파일을 감지하면 터미널에 메시지를 출력합니다. 이 메시지를 본 에이전트가 즉시 `RULES.md`를 읽고 지시에 따라 `wiki/` 디렉토리에 마크다운 문서를 자동 생성(컴파일)합니다.

---

## 🛠 MCP Tool 목록과 동작

이 프로젝트는 에이전트가 지식망의 구조를 이해할 수 있도록 MCP(Model Context Protocol) 서버를 제공합니다.

*   **구동 방식:** `tools/server/mcp.js`를 stdio 방식으로 실행
*   **제공되는 Tool:**
    *   `get_knowledge_graph`: `wiki/` 디렉토리 내의 모든 마크다운 파일을 파싱하여, 문서 간의 `[[링크]]` 관계를 노드(Node)와 엣지(Edge)로 구성된 JSON 데이터로 반환합니다. 에이전트는 이를 통해 전체 지식망의 구조를 파악하고 다음 문서 작성 시 연결 고리를 추론할 수 있습니다.

---

## ✅ 검증 방법

1. 뷰어 웹페이지(`http://localhost:5173`)에 접속합니다.
2. 좌측 사이드바의 **"📄 Documents"** 탭에서 방금 에이전트가 생성한 위키 문서를 클릭하여 내용을 확인합니다.
3. **"🕸️ Knowledge Graph"** 탭을 클릭하여, 생성된 문서가 노드로 표현되고 다른 문서들과 선으로 연결된 지식 그래프가 정상적으로 렌더링되는지 확인합니다.
