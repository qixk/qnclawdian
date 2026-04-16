/**
 * QNClawdian i18n — 国际化支持
 * 支持语言: 中文(zh), 英文(en), 日文(ja), 韩文(ko)
 */

export type Locale = 'en' | 'zh' | 'ja' | 'ko';

export interface I18nStrings {
  // Plugin
  pluginName: string;
  openChat: string;
  newConversation: string;

  // Chat View
  chatTitle: string;
  welcomeTitle: string;
  welcomeDesc: string;
  welcomeFeature1: string;
  welcomeFeature2: string;
  welcomeFeature3: string;
  welcomeFeature4: string;
  inputPlaceholder: string;
  send: string;
  thinking: string;
  clearChat: string;
  copyMessage: string;
  copied: string;
  copyAll: string;
  copiedAll: string;

  // Settings
  settings: string;
  connection: string;
  connectionMode: string;
  gatewayUrl: string;
  ollamaUrl: string;
  modelSelection: string;
  model: string;
  temperature: string;
  testConnection: string;
  testing: string;
  connectionSuccess: string;
  connectionFailed: string;
  connectionError: string;
  memoryEnabled: string;
  memoryEnabledDesc: string;
  autoLinks: string;
  autoLinksDesc: string;

  // Agent
  selectAgent: string;
  agentDefault: string;

  // Errors
  errorNoConnection: string;
  errorTimeout: string;
  errorUnknown: string;
}

const en: I18nStrings = {
  pluginName: 'QNClawdian',
  openChat: 'Open QNClawdian',
  newConversation: 'New QNClawdian conversation',

  chatTitle: 'QNClawdian',
  welcomeTitle: '🧠 QNClawdian',
  welcomeDesc: 'Brain-inspired AI assistant in your vault',
  welcomeFeature1: '💬 Chat with local or cloud AI models',
  welcomeFeature2: '🔗 Auto [[]] bidirectional links',
  welcomeFeature3: '🧠 Brain-region memory architecture',
  welcomeFeature4: '📊 Obsidian graph integration',
  inputPlaceholder: 'Ask anything... (Enter to send)',
  send: 'Send',
  thinking: 'Thinking...',
  clearChat: 'Clear chat',
  copyMessage: 'Copy',
  copied: 'Copied!',
  copyAll: 'Copy all',
  copiedAll: 'All copied!',

  settings: 'QNClawdian Settings',
  connection: '🔗 Connection',
  connectionMode: 'Connection mode',
  gatewayUrl: 'Gateway URL',
  ollamaUrl: 'Ollama URL',
  modelSelection: '🤖 Model',
  model: 'Model',
  temperature: 'Temperature',
  testConnection: 'Test connection',
  testing: 'Testing...',
  connectionSuccess: '✅ Connection successful!',
  connectionFailed: '❌ Connection failed. Check your settings.',
  connectionError: '❌ Connection error',
  memoryEnabled: 'Enable memory',
  memoryEnabledDesc: 'Load vault memories into conversations',
  autoLinks: 'Auto [[]] links',
  autoLinksDesc: 'Automatically add bidirectional links when writing',

  selectAgent: 'Select Agent',
  agentDefault: 'Default',

  errorNoConnection: 'Not connected. Check settings.',
  errorTimeout: 'Request timed out.',
  errorUnknown: 'An unknown error occurred.',
};

const zh: I18nStrings = {
  pluginName: 'QNClawdian',
  openChat: '打开 QNClawdian',
  newConversation: '新建对话',

  chatTitle: 'QNClawdian',
  welcomeTitle: '🧠 QNClawdian',
  welcomeDesc: '仿生记忆 AI 助手，就在你的知识库中',
  welcomeFeature1: '💬 与本地或云端 AI 模型聊天',
  welcomeFeature2: '🔗 自动生成 [[]] 双向链接',
  welcomeFeature3: '🧠 仿生记忆架构（海马体/前额叶/杏仁核...）',
  welcomeFeature4: '📊 Obsidian 关系图谱联动',
  inputPlaceholder: '输入问题...（Enter 发送，Shift+Enter 换行）',
  send: '发送',
  thinking: '思考中...',
  clearChat: '清空对话',
  copyMessage: '复制',
  copied: '已复制！',
  copyAll: '复制全部对话',
  copiedAll: '全部已复制！',

  settings: 'QNClawdian 设置',
  connection: '🔗 连接配置',
  connectionMode: '连接模式',
  gatewayUrl: 'Gateway 地址',
  ollamaUrl: 'Ollama 地址',
  modelSelection: '🤖 模型选择',
  model: '模型',
  temperature: '温度',
  testConnection: '测试连接',
  testing: '测试中...',
  connectionSuccess: '✅ 连接成功！',
  connectionFailed: '❌ 连接失败，请检查设置。',
  connectionError: '❌ 连接错误',
  memoryEnabled: '启用记忆',
  memoryEnabledDesc: '将知识库记忆加载到对话中',
  autoLinks: '自动 [[]] 链接',
  autoLinksDesc: '写入时自动添加双向链接',

  selectAgent: '选择 Agent',
  agentDefault: '默认',

  errorNoConnection: '未连接，请检查设置。',
  errorTimeout: '请求超时。',
  errorUnknown: '发生未知错误。',
};

const ja: I18nStrings = {
  pluginName: 'QNClawdian',
  openChat: 'QNClawdian を開く',
  newConversation: '新しい会話',

  chatTitle: 'QNClawdian',
  welcomeTitle: '🧠 QNClawdian',
  welcomeDesc: 'ボールトに組み込まれた脳型AIアシスタント',
  welcomeFeature1: '💬 ローカルまたはクラウドAIモデルとチャット',
  welcomeFeature2: '🔗 [[]] 双方向リンクを自動生成',
  welcomeFeature3: '🧠 脳領域メモリアーキテクチャ',
  welcomeFeature4: '📊 Obsidian グラフビュー連携',
  inputPlaceholder: '質問を入力...（Enter で送信）',
  send: '送信',
  thinking: '考え中...',
  clearChat: 'チャットをクリア',
  copyMessage: 'コピー',
  copied: 'コピーしました！',
  copyAll: 'すべてコピー',
  copiedAll: 'すべてコピーしました！',

  settings: 'QNClawdian 設定',
  connection: '🔗 接続設定',
  connectionMode: '接続モード',
  gatewayUrl: 'Gateway URL',
  ollamaUrl: 'Ollama URL',
  modelSelection: '🤖 モデル選択',
  model: 'モデル',
  temperature: '温度',
  testConnection: '接続テスト',
  testing: 'テスト中...',
  connectionSuccess: '✅ 接続成功！',
  connectionFailed: '❌ 接続失敗。設定を確認してください。',
  connectionError: '❌ 接続エラー',
  memoryEnabled: 'メモリを有効化',
  memoryEnabledDesc: 'ボールトの記憶を会話に読み込む',
  autoLinks: '自動 [[]] リンク',
  autoLinksDesc: '書き込み時に双方向リンクを自動追加',

  selectAgent: 'エージェント選択',
  agentDefault: 'デフォルト',

  errorNoConnection: '未接続。設定を確認してください。',
  errorTimeout: 'リクエストがタイムアウトしました。',
  errorUnknown: '不明なエラーが発生しました。',
};

const ko: I18nStrings = {
  pluginName: 'QNClawdian',
  openChat: 'QNClawdian 열기',
  newConversation: '새 대화',

  chatTitle: 'QNClawdian',
  welcomeTitle: '🧠 QNClawdian',
  welcomeDesc: '볼트에 내장된 뇌 영감 AI 어시스턴트',
  welcomeFeature1: '💬 로컬 또는 클라우드 AI 모델과 채팅',
  welcomeFeature2: '🔗 [[]] 양방향 링크 자동 생성',
  welcomeFeature3: '🧠 뇌 영역 메모리 아키텍처',
  welcomeFeature4: '📊 Obsidian 그래프 뷰 연동',
  inputPlaceholder: '질문을 입력하세요... (Enter로 전송)',
  send: '전송',
  thinking: '생각 중...',
  clearChat: '대화 지우기',
  copyMessage: '복사',
  copied: '복사됨!',
  copyAll: '전체 복사',
  copiedAll: '전체 복사됨!',

  settings: 'QNClawdian 설정',
  connection: '🔗 연결 설정',
  connectionMode: '연결 모드',
  gatewayUrl: 'Gateway URL',
  ollamaUrl: 'Ollama URL',
  modelSelection: '🤖 모델 선택',
  model: '모델',
  temperature: '온도',
  testConnection: '연결 테스트',
  testing: '테스트 중...',
  connectionSuccess: '✅ 연결 성공!',
  connectionFailed: '❌ 연결 실패. 설정을 확인하세요.',
  connectionError: '❌ 연결 오류',
  memoryEnabled: '메모리 활성화',
  memoryEnabledDesc: '볼트 메모리를 대화에 로드',
  autoLinks: '자동 [[]] 링크',
  autoLinksDesc: '작성 시 양방향 링크 자동 추가',

  selectAgent: '에이전트 선택',
  agentDefault: '기본',

  errorNoConnection: '연결되지 않았습니다. 설정을 확인하세요.',
  errorTimeout: '요청 시간이 초과되었습니다.',
  errorUnknown: '알 수 없는 오류가 발생했습니다.',
};

const locales: Record<Locale, I18nStrings> = { en, zh, ja, ko };

let currentLocale: Locale = 'en';

/**
 * 自动检测语言（基于 Obsidian 设置）
 */
export function detectLocale(): Locale {
  // @ts-ignore — Obsidian internal
  const obsLang: string = window?.localStorage?.getItem('language') || navigator?.language || 'en';
  if (obsLang.startsWith('zh')) return 'zh';
  if (obsLang.startsWith('ja')) return 'ja';
  if (obsLang.startsWith('ko')) return 'ko';
  return 'en';
}

export function setLocale(locale: Locale): void {
  currentLocale = locale;
}

export function t(key: keyof I18nStrings): string {
  return locales[currentLocale]?.[key] ?? locales.en[key] ?? key;
}

export function initI18n(): void {
  currentLocale = detectLocale();
}
