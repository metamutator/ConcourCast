import { useState } from 'react';
import * as XLSX from 'xlsx';

export default function AdminPanel() {
  const [jsonOutput, setJsonOutput] = useState('');
  const [error, setError] = useState('');
  const [fileName, setFileName] = useState('');

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setFileName(file.name);
    setError('');
    setJsonOutput('');

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });

        // Read Teams sheet
        const teamsSheet = workbook.Sheets['Teams'];
        if (!teamsSheet) {
          throw new Error('Missing "Teams" sheet in Excel file');
        }
        const teamsData = XLSX.utils.sheet_to_json(teamsSheet);

        // Read Schedule sheet
        const scheduleSheet = workbook.Sheets['Schedule'];
        if (!scheduleSheet) {
          throw new Error('Missing "Schedule" sheet in Excel file');
        }
        const scheduleData = XLSX.utils.sheet_to_json(scheduleSheet);

        // Validate and transform data
        const teams = teamsData.map((row, index) => {
          if (!row.TeamName || !row.Division) {
            throw new Error(`Invalid team data at row ${index + 2} in Teams sheet`);
          }
          return {
            name: row.TeamName,
            division: parseInt(row.Division)
          };
        });

        const matches = scheduleData.map((row, index) => {
          if (!row.Round || !row.Team1 || !row.Team2) {
            throw new Error(`Invalid match data at row ${index + 2} in Schedule sheet`);
          }
          return {
            round: parseInt(row.Round),
            team1: row.Team1,
            team2: row.Team2,
            team1Score: row.Team1Score !== undefined && row.Team1Score !== '' && row.Team1Score !== null
              ? parseFloat(row.Team1Score)
              : null,
            team2Score: row.Team2Score !== undefined && row.Team2Score !== '' && row.Team2Score !== null
              ? parseFloat(row.Team2Score)
              : null
          };
        });

        // Determine current round (highest round with at least one completed match)
        let currentRound = 0;
        for (const match of matches) {
          if (match.team1Score !== null && match.team2Score !== null) {
            currentRound = Math.max(currentRound, match.round);
          }
        }

        // Build final JSON structure
        const tournamentData = {
          lastUpdated: new Date().toISOString(),
          tournament: {
            name: "John Molson MBA International Case Competition 2026",
            totalRounds: 5,
            currentRound: currentRound
          },
          teams: teams,
          matches: matches
        };

        setJsonOutput(JSON.stringify(tournamentData, null, 2));
      } catch (err) {
        setError(`Error processing Excel file: ${err.message}`);
        console.error(err);
      }
    };

    reader.onerror = () => {
      setError('Error reading file');
    };

    reader.readAsArrayBuffer(file);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(jsonOutput);
    alert('JSON copied to clipboard!');
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">
          🔧 Admin Panel
        </h2>

        <div className="mb-6">
          <p className="text-gray-600 mb-4">
            Upload an Excel file with two sheets: <strong>Teams</strong> and <strong>Schedule</strong>
          </p>

          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors">
            <input
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileUpload}
              className="hidden"
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              className="cursor-pointer inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              📁 Choose Excel File
            </label>
            {fileName && (
              <p className="mt-3 text-sm text-gray-600">
                Selected: <strong>{fileName}</strong>
              </p>
            )}
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800 font-medium">❌ {error}</p>
          </div>
        )}

        {jsonOutput && (
          <div className="space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-green-800 font-medium">✅ Excel file processed successfully!</p>
            </div>

            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-800">Generated JSON:</h3>
              <button
                onClick={copyToClipboard}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                📋 Copy to Clipboard
              </button>
            </div>

            <div className="bg-gray-50 border border-gray-300 rounded-lg p-4 overflow-auto max-h-96">
              <pre className="text-sm text-gray-800 font-mono whitespace-pre">
                {jsonOutput}
              </pre>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-blue-800 font-medium mb-2">📝 Next Steps:</p>
              <ol className="list-decimal list-inside text-blue-700 space-y-1">
                <li>Copy the JSON above (use the button)</li>
                <li>Open <code className="bg-blue-100 px-1 rounded">public/tournament-data.json</code> in your code editor</li>
                <li>Replace the entire file contents with the copied JSON</li>
                <li>Commit and push to git: <code className="bg-blue-100 px-1 rounded">git add . && git commit -m "Update tournament data" && git push</code></li>
                <li>Vercel will auto-deploy in ~60 seconds</li>
              </ol>
            </div>
          </div>
        )}

        <div className="mt-8 pt-6 border-t border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">📋 Excel Template Format:</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-700 mb-2">Sheet 1: "Teams"</h4>
              <table className="w-full text-sm border border-gray-300">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="border border-gray-300 px-2 py-1">TeamName</th>
                    <th className="border border-gray-300 px-2 py-1">Division</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-gray-300 px-2 py-1">Team A</td>
                    <td className="border border-gray-300 px-2 py-1">1</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-2 py-1">Team B</td>
                    <td className="border border-gray-300 px-2 py-1">1</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-2 py-1">...</td>
                    <td className="border border-gray-300 px-2 py-1">...</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-700 mb-2">Sheet 2: "Schedule"</h4>
              <table className="w-full text-sm border border-gray-300">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="border border-gray-300 px-1 py-1 text-xs">Round</th>
                    <th className="border border-gray-300 px-1 py-1 text-xs">Team1</th>
                    <th className="border border-gray-300 px-1 py-1 text-xs">Team2</th>
                    <th className="border border-gray-300 px-1 py-1 text-xs">Team1Score</th>
                    <th className="border border-gray-300 px-1 py-1 text-xs">Team2Score</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-gray-300 px-1 py-1 text-center">1</td>
                    <td className="border border-gray-300 px-1 py-1">Team A</td>
                    <td className="border border-gray-300 px-1 py-1">Team B</td>
                    <td className="border border-gray-300 px-1 py-1 text-center">85</td>
                    <td className="border border-gray-300 px-1 py-1 text-center">78</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-1 py-1 text-center">1</td>
                    <td className="border border-gray-300 px-1 py-1">Team C</td>
                    <td className="border border-gray-300 px-1 py-1">Team D</td>
                    <td className="border border-gray-300 px-1 py-1 text-center"></td>
                    <td className="border border-gray-300 px-1 py-1 text-center"></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
