import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Eye, EyeOff } from "lucide-react";
import { AppSettings, loadSettings, saveSettings } from "src/lib/settings";

function SettingsPage() {
  const navigate = useNavigate();
  const [settings, setSettings] = useState<AppSettings>(loadSettings());
  const [showApiKey, setShowApiKey] = useState(false);
  const [showDatabaseUrl, setShowDatabaseUrl] = useState(false);
  const [isDatabaseConnected, setIsDatabaseConnected] = useState(
    Boolean(loadSettings().databaseUrl.trim()),
  );

  useEffect(() => {
    const loadedSettings = loadSettings();
    setSettings(loadedSettings);
    setIsDatabaseConnected(Boolean(loadedSettings.databaseUrl.trim()));
  }, []);

  const onConnectDatabase = () => {
    const databaseUrl = settings.databaseUrl.trim();
    if (!databaseUrl) {
      setIsDatabaseConnected(false);
      return;
    }
    const nextSettings = { ...settings, databaseUrl };
    setSettings(nextSettings);
    saveSettings(nextSettings);
    setIsDatabaseConnected(true);
  };

  const onSave = () => {
    saveSettings(settings);
    navigate({ to: "/chatpage" });
  };

  return (
    <div className="min-h-screen bg-black text-white flex justify-center px-4 py-10 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(22,163,74,0.35),_transparent_40%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_rgba(59,130,246,0.18),_transparent_45%)]" />
      <div className="relative w-full max-w-2xl bg-gray-700/20 backdrop-blur-2xl border border-gray-700/50 rounded-2xl p-6 flex flex-col gap-4 shadow-[0_0_0_1px_rgba(255,255,255,0.03)] font-semibold">
        <h1 className="text-2xl font-bold">Settings</h1>
        <label className="text-sm text-gray-200 font-bold">Model Provider</label>
        <select
          value={settings.modelProvider}
          onChange={(e) =>
            setSettings({
              ...settings,
              modelProvider: e.target.value as "openai" | "openrouter" | "ollama",
            })
          }
          className="theme-select h-11 rounded-lg bg-gray-800 border border-gray-700 text-white"
        >
          <option value="ollama">Ollama (Local)</option>
          <option value="openai">OpenAI</option>
          <option value="openrouter">OpenRouter</option>
        </select>
        <label className="text-sm text-gray-200 font-bold">
          API Key (OpenAI/OpenRouter)
        </label>
        <div className="relative">
          <input
            type={showApiKey ? "text" : "password"}
            value={settings.apiKey}
            onChange={(e) => setSettings({ ...settings, apiKey: e.target.value })}
            placeholder="sk-..."
            className="h-11 w-full rounded-lg px-3 pr-10 bg-gray-800 border border-gray-700"
          />
          <button
            type="button"
            onClick={() => setShowApiKey((prev) => !prev)}
            aria-label={showApiKey ? "Hide API key" : "Show API key"}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-white"
          >
            {showApiKey ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        <label className="text-sm text-gray-200 font-bold">Database URL</label>
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <input
              type={showDatabaseUrl ? "text" : "password"}
              value={settings.databaseUrl}
              onChange={(e) => {
                const value = e.target.value;
                setSettings({ ...settings, databaseUrl: value });
                if (!value.trim()) {
                  setIsDatabaseConnected(false);
                }
              }}
              placeholder="postgresql://..."
              className="h-11 w-full rounded-lg px-3 pr-10 bg-gray-800 border border-gray-700"
            />
            <button
              type="button"
              onClick={() => setShowDatabaseUrl((prev) => !prev)}
              aria-label={showDatabaseUrl ? "Hide database URL" : "Show database URL"}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-white"
            >
              {showDatabaseUrl ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          <button
            type="button"
            onClick={onConnectDatabase}
            disabled={isDatabaseConnected}
            className="h-11 px-4 rounded-lg border border-gray-700 bg-gray-800 text-sm font-semibold text-white disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isDatabaseConnected ? "Connected" : "Connect"}
          </button>
        </div>
        <label className="text-sm text-gray-200 font-bold">Ollama Base URL</label>
        <input
          value={settings.ollamaUrl}
          onChange={(e) => setSettings({ ...settings, ollamaUrl: e.target.value })}
          placeholder="http://localhost:11434"
          className="h-11 rounded-lg px-3 bg-gray-800 border border-gray-700"
        />
        <label className="text-sm text-gray-200 font-bold">OpenAI Model</label>
        <input
          value={settings.openaiModel}
          onChange={(e) => setSettings({ ...settings, openaiModel: e.target.value })}
          className="h-11 rounded-lg px-3 bg-gray-800 border border-gray-700"
        />
        <label className="text-sm text-gray-200 font-bold">OpenRouter Base URL</label>
        <input
          value={settings.openrouterBaseUrl}
          onChange={(e) =>
            setSettings({ ...settings, openrouterBaseUrl: e.target.value })
          }
          className="h-11 rounded-lg px-3 bg-gray-800 border border-gray-700"
        />
        <label className="text-sm text-gray-200 font-bold">OpenRouter Model</label>
        <input
          value={settings.openrouterModel}
          onChange={(e) =>
            setSettings({ ...settings, openrouterModel: e.target.value })
          }
          className="h-11 rounded-lg px-3 bg-gray-800 border border-gray-700"
        />
        <label className="text-sm text-gray-200 font-bold">Ollama Model</label>
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
