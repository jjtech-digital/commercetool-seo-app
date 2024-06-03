
import { createRules, getAllRules } from '../fetcherFunction/ruleFetcher';

export function useSettings() {
  const createRuleshandler = async (payload: any, setState: Function) => {
    const response = await createRules(payload, setState);
    return response;
  };

  const getsavedRules = async (token: string, setState: Function) => {
    const response = await getAllRules(token,setState);
    return response;
  };
  return { createRuleshandler, getsavedRules };
}
