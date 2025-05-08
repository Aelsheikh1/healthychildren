Option Explicit

' Get the current script directory
Dim objFSO, objShell, strScriptPath, strProjectPath
Set objFSO = CreateObject("Scripting.FileSystemObject")
Set objShell = CreateObject("WScript.Shell")

' Get the script path and project path
strScriptPath = objFSO.GetAbsolutePathName(WScript.ScriptFullName)
strProjectPath = objFSO.GetParentFolderName(strScriptPath)

' Function to run a command
Function RunCommand(command)
    Dim objExec
    Set objExec = objShell.Exec(command)
    
    ' Wait for the command to start
    WScript.Sleep 1000
    
    Set objExec = Nothing
End Function

' Function to open URL in default browser
Function OpenInBrowser(url)
    objShell.Run "cmd /c start " & url, 1, False
End Function

' Main script

' 1. Kill any running Node.js processes
objShell.Run "taskkill /F /IM node.exe", 0, True

' 2. Start API server in a new window
objShell.Run "cmd /k cd /d " & strProjectPath & " && node src/api/server.js", 1, False

' Wait for API server to start
WScript.Sleep 3000

' 3. Start React development server in a new window
objShell.Run "cmd /k cd /d " & strProjectPath & " && npm start", 1, False

' Wait for React server to start
WScript.Sleep 5000

' 4. Open the application in the default browser
OpenInBrowser "http://localhost:3000"

' Show success message to user
objShell.Popup "MealInfo application is starting up. Please wait a moment for the servers to fully initialize. The application will open in your default browser shortly.", 5, "MealInfo Starting", vbInformation

' Clean up
Set objFSO = Nothing
Set objShell = Nothing
