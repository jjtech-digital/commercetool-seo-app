import { getSavedAiKey, saveAiKey } from '../fetcherFunction/aiKeyFetchers';

export function useAiKey() {
  const saveAiKeyHandler = async (aiKey: string, setState: Function) => {
    const response = await saveAiKey(aiKey, setState);
    return response;
  };
  const getSavedAiKeyHandler = (setState: Function) => {
    const response = getSavedAiKey(setState);
    return response;
  };
  return { saveAiKeyHandler, getSavedAiKeyHandler };
}
