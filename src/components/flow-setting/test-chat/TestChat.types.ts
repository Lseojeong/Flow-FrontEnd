export interface TestChatProps {
  onTestRun?: (_question: string) => Promise<string>;
  loading?: boolean;
}
