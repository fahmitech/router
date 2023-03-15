import {
  DiagnosticCategory,
  FormatCodeSettings,
  TextChange,
  UserPreferences,
} from "typescript";
import { getImportTextChange, getReplaceLineSpan } from "../code-fixes";
import { EXPO_TS_CODES } from "../errors";
import { RuleContext } from "../rules/context";
import { SuggestionContext } from "./suggestion";

export function typedSettingSuggestion(
  node: ts.Node,
  { prior, ts, source, Log }: RuleContext
) {
  const settingsNode =
    ts.isVariableStatement(node) &&
    node.declarationList.declarations.find((declaration) => {
      return declaration.name.getText() === "unstable_settings";
    });

  if (settingsNode && settingsNode.type?.getText() !== "RouterSettings") {
    const start = node.getStart();
    const end = settingsNode.getEnd();

    Log.info("typedSettingSuggestion", start, end);

    prior.push({
      category: DiagnosticCategory.Suggestion,
      code: EXPO_TS_CODES.MISSING_SETTINGS_TYPE,
      messageText:
        "Missing or incorrect type. Use code actions to automatically add the correct type.",
      file: source,
      start,
      length: end - start,
    });
  }
}

export function typedSettingCodeAction(
  { prior, source, ts }: SuggestionContext,
  fileName: string,
  start: number,
  _end: number,
  errorCodes: readonly number[],
  _formatOptions: FormatCodeSettings,
  _preferences: UserPreferences
) {
  if (errorCodes.indexOf(EXPO_TS_CODES.MISSING_SETTINGS_TYPE) === -1) {
    return;
  }

  const importChange = getImportTextChange({
    ts,
    source,
    module: "expo-router",
    identifier: "RouterSettings",
  });

  const textChanges = [
    importChange,
    {
      span: getReplaceLineSpan(start, source),
      newText: "export const unstable_settings: RouterSettings = {",
    },
  ].filter((c) => !!c) as TextChange[];

  prior.push({
    fixName: "expo-router_suggestion_settings-type",
    description: "(Expo Router) Add missing type definition",
    changes: [
      {
        fileName,
        textChanges,
      },
    ],
  });
}
