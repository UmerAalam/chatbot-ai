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
    <div className="min-h-screen bg-black text-white flex justify-center px-4 py-10 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(22,163,74,0.35),_transparent_40%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_rgba(59,130,246,0.18),_transparent_45%)]" />
      <div className="relative w-full max-w-2xl bg-gray-700/20 backdrop-blur-2xl border border-gray-700/50 rounded-2xl p-6 flex flex-col gap-4 shadow-[0_0_0_1px_rgba(255,255,255,0.03)]">
        <h1 className="text-2xl font-bold">Settings</h1>
        <label className="text-sm text-gray-200">Model Provider</label>
        <select
          value={settings.modelProvider}
          onChange={(e) =>
            setSettings({
              ...settings,
              modelProvider: e.target.value as "openai" | "openrouter" | "ollama",
            })
          }
          className="h-11 rounded-lg px-3 bg-gray-800 border border-gray-700"
        >
          <option value="ollama">Ollama (Local)</option>
          <option value="openai">OpenAI</option>
          <option value="openrouter">OpenRouter</option>
        </select>
        <label className="text-sm text-gray-200">
          API Key (OpenAI/OpenRouter)
        </label>
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
        <label className="text-sm text-gray-200">OpenRouter Base URL</label>
        <input
          value={settings.openrouterBaseUrl}
          onChange={(e) =>
            setSettings({ ...settings, openrouterBaseUrl: e.target.value })
          }
          className="h-11 rounded-lg px-3 bg-gray-800 border border-gray-700"
        />
        <label className="text-sm text-gray-200">OpenRouter Model</label>
        <input
          value={settings.openrouterModel}
          onChange={(e) =>
            setSettings({ ...settings, openrouterModel: e.target.value })
          }
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
            className="h-11 px-5 rounded-2xl bg-white text-gray-800 hover:bg-red-500 hover:text-white border-2 border-transparent hover:border-white font-bold"
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            className="h-11 px-5 rounded-2xl bg-green-400 text-green-900 hover:text-white border-2 border-transparent hover:border-white font-bold"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

export default SettingsPage;
