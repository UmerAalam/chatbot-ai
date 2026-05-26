import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { AppSettings, loadSettings, saveSettings } from "src/lib/settings";

function SettingsPage() {
  const navigate = useNavigate();
  const [settings, setSettings] = useState<AppSettings>(loadSettings());

  useEffect(() => {
    setSettings(loadSettings());
  }, []);

  const onSave = () => {
    saveSettings(settings);
    navigate({ to: "/chatpage" });
  };

  return (
    <div className="min-h-screen bg-black text-white flex justify-center px-4 py-10">
      <div className="w-full max-w-2xl bg-gray-900/80 border border-gray-700 rounded-2xl p-6 flex flex-col gap-4">
        <h1 className="text-2xl font-bold">Settings</h1>
        <label className="text-sm text-gray-200">Model Provider</label>
        <select
          value={settings.modelProvider}
          onChange={(e) =>
            setSettings({ ...settings, modelProvider: e.target.value as "openai" | "ollama" })
          }
          className="h-11 rounded-lg px-3 bg-gray-800 border border-gray-700"
        >
          <option value="ollama">Ollama (Local)</option>
          <option value="openai">OpenAI</option>
        </select>
        <label className="text-sm text-gray-200">API Key (for OpenAI)</label>
        <input
          value={settings.apiKey}
          onChange={(e) => setSettings({ ...settings, apiKey: e.target.value })}
          placeholder="sk-..."
          className="h-11 rounded-lg px-3 bg-gray-800 border border-gray-700"
        />
        <label className="text-sm text-gray-200">Database URL</label>
        <input
          value={settings.databaseUrl}
          onChange={(e) => setSettings({ ...settings, databaseUrl: e.target.value })}
          placeholder="postgresql://..."
          className="h-11 rounded-lg px-3 bg-gray-800 border border-gray-700"
        />
        <label className="text-sm text-gray-200">Ollama Base URL</label>
        <input
          value={settings.ollamaUrl}
          onChange={(e) => setSettings({ ...settings, ollamaUrl: e.target.value })}
          placeholder="http://localhost:11434"
          className="h-11 rounded-lg px-3 bg-gray-800 border border-gray-700"
        />
        <label className="text-sm text-gray-200">OpenAI Model</label>
        <input
          value={settings.openaiModel}
          onChange={(e) => setSettings({ ...settings, openaiModel: e.target.value })}
          className="h-11 rounded-lg px-3 bg-gray-800 border border-gray-700"
        />
        <label className="text-sm text-gray-200">Ollama Model</label>
        <input
          value={settings.ollamaModel}
          onChange={(e) => setSettings({ ...settings, ollamaModel: e.target.value })}
          className="h-11 rounded-lg px-3 bg-gray-800 border border-gray-700"
        />
        <div className="flex gap-3 pt-2">
          <button
            onClick={() => navigate({ to: "/chatpage" })}
            className="h-11 px-4 rounded-lg border border-gray-600"
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            className="h-11 px-4 rounded-lg bg-green-600 hover:bg-green-500 font-semibold"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

export default SettingsPage;
