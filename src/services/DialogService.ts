import { spawn } from 'child_process';

export type DialogIcon = 'None' | 'Hand' | 'Question' | 'Exclamation' | 'Asterisk' | 'Stop' | 'Error' | 'Warning' | 'Information';
export type DialogButtons = 'OK' | 'OKCancel' | 'AbortRetryIgnore' | 'YesNoCancel' | 'YesNo' | 'RetryCancel';

class DialogService {
    // Maps PowerShell result strings to standard indices if needed, or returns raw result.
    // PowerShell [System.Windows.Forms.MessageBoxResult] values:
    // None=0, OK=1, Cancel=2, Abort=3, Retry=4, Ignore=5, Yes=6, No=7

    public async show(message: string, title: string, buttons: DialogButtons = 'OK', icon: DialogIcon = 'Information'): Promise<string> {
        if (process.platform === 'linux') {
            return this.runZenityShow(message, title, buttons, icon);
        } else if (process.platform === 'darwin') {
            return this.runOsaShow(message, title, buttons, icon);
        }

        // Windows Fallback
        // Escape quotes for PowerShell
        const safeMsg = message.replace(/"/g, '`"').replace(/'/g, "''");
        const safeTitle = title.replace(/"/g, '`"').replace(/'/g, "''");

        const psCommand = `
            Add-Type -AssemblyName System.Windows.Forms;
            [System.Windows.Forms.MessageBox]::Show("${safeMsg}", "${safeTitle}", [System.Windows.Forms.MessageBoxButtons]::${buttons}, [System.Windows.Forms.MessageBoxIcon]::${icon});
        `;

        return this.runPowerShell(psCommand);
    }

    public async showSelectionDialog(title: string, message: string, options: string[], defaultOptionIndex: number = 0): Promise<string> {
        if (process.platform === 'linux') {
            return this.runZenitySelection(title, message, options);
        } else if (process.platform === 'darwin') {
            return this.runOsaSelection(title, message, options, defaultOptionIndex);
        }

        const safeTitle = title.replace(/"/g, '`"').replace(/'/g, "''");
        const safeMsg = message.replace(/"/g, '`"').replace(/'/g, "''");

        // Dynamic RadioButton generation
        let radioButtonsScript = "";
        let yPos = 100;
        options.forEach((opt, index) => {
            const checked = index === defaultOptionIndex ? '$true' : '$false';
            radioButtonsScript += `
            $rb${index} = New-Object System.Windows.Forms.RadioButton
            $rb${index}.Text = "${opt}"
            $rb${index}.AutoSize = $true
            $rb${index}.Location = New-Object System.Drawing.Point(30, ${yPos})
            $rb${index}.Checked = ${checked}
            $form.Controls.Add($rb${index})
            `;
            yPos += 30;
        });

        const psCommand = `
            Add-Type -AssemblyName System.Windows.Forms
            Add-Type -AssemblyName System.Drawing

            $form = New-Object System.Windows.Forms.Form
            $form.Text = "${safeTitle}"
            $form.Size = New-Object System.Drawing.Size(350, ${yPos + 100})
            $form.StartPosition = "CenterScreen"
            $form.FormBorderStyle = "FixedDialog"
            $form.MaximizeBox = $false
            $form.MinimizeBox = $false

            $label = New-Object System.Windows.Forms.Label
            $label.Text = "${safeMsg}"
            $label.Location = New-Object System.Drawing.Point(20, 20)
            $label.Size = New-Object System.Drawing.Size(300, 70)
            $form.Controls.Add($label)

            ${radioButtonsScript}

            $okButton = New-Object System.Windows.Forms.Button
            $okButton.Location = New-Object System.Drawing.Point(120, ${yPos + 20})
            $okButton.Size = New-Object System.Drawing.Size(75, 23)
            $okButton.Text = "OK"
            $okButton.DialogResult = [System.Windows.Forms.DialogResult]::OK
            $form.AcceptButton = $okButton
            $form.Controls.Add($okButton)

            $form.TopMost = $true
            $result = $form.ShowDialog()

            if ($result -eq [System.Windows.Forms.DialogResult]::OK) {
                ${options.map((_, i) => `if ($rb${i}.Checked) { return "${options[i]}" }`).join('; ')}
            }
            return "Cancel"
        `;

        return this.runPowerShell(psCommand);
    }

    public async selectFolder(description: string): Promise<string> {
        if (process.platform === 'linux') {
            return this.runZenityFolder(description);
        } else if (process.platform === 'darwin') {
            return this.runOsaFolder(description);
        }

        const safeDesc = description.replace(/"/g, '`"').replace(/'/g, "''");

        const psCommand = `
            Add-Type -AssemblyName System.Windows.Forms
            $fbd = New-Object System.Windows.Forms.FolderBrowserDialog
            $fbd.Description = "${safeDesc}"
            $fbd.ShowNewFolderButton = $false
            
            # Allow to start at MyComputer
            $fbd.RootFolder = [System.Environment+SpecialFolder]::MyComputer

            $result = $fbd.ShowDialog()

            if ($result -eq [System.Windows.Forms.DialogResult]::OK) {
                return $fbd.SelectedPath
            }
            return ""
        `;

        return this.runPowerShell(psCommand);
    }

    // --- Native Helpers ---

    private execPromise(cmd: string): Promise<string> {
        return new Promise((resolve, reject) => {
            const child = spawn(cmd, { shell: true });
            let stdout = '';
            child.stdout.on('data', d => stdout += d.toString());
            child.on('close', () => resolve(stdout.trim()));
            child.on('error', (e) => reject(e));
        });
    }

    // Linux (Zenity)
    private async runZenityShow(message: string, title: string, buttons: DialogButtons, icon: DialogIcon): Promise<string> {
        // Map icon to type
        let type = '--info';
        if (icon === 'Error') type = '--error';
        if (icon === 'Warning') type = '--warning';
        if (icon === 'Question') type = '--question';

        // simple zenity doesn't support custom buttons easily like MessageBox
        // It returns 0 for OK/Yes, 1 for Cancel/No.
        // We map standard buttons

        try {
            await this.execPromise(`zenity ${type} --text="${message}" --title="${title}"`);
            // If success (exit code 0), return OK or Yes
            if (buttons.includes('Yes')) return 'Yes';
            return 'OK';
        } catch (e) {
            // Exit code 1 usually means Cancel/No
            if (buttons.includes('No')) return 'No';
            return 'Cancel';
        }
    }

    private async runZenitySelection(title: string, message: string, options: string[]): Promise<string> {
        // zenity --list --radiolist --column "Pick" --column "Option" FALSE "Opt1" TRUE "Opt2"
        const opts = options.map(o => `FALSE "${o}"`).join(' ');
        try {
            const res = await this.execPromise(`zenity --list --radiolist --text="${message}" --title="${title}" --column="Select" --column="Option" ${opts}`);
            return res || 'Cancel';
        } catch {
            return 'Cancel';
        }
    }

    private async runZenityFolder(desc: string): Promise<string> {
        try {
            const res = await this.execPromise(`zenity --file-selection --directory --title="${desc}"`);
            return res;
        } catch {
            return '';
        }
    }

    // MacOS (OsaScript)
    private async runOsaShow(message: string, title: string, buttons: DialogButtons, icon: DialogIcon): Promise<string> {
        // display dialog "message" with title "title" buttons {"OK"} default button "OK" with icon note
        let iconStr = 'note';
        if (icon === 'Error') iconStr = 'stop';
        if (icon === 'Warning') iconStr = 'caution';

        let btns = '{"OK"}';
        if (buttons === 'YesNo') btns = '{"Yes", "No"}';

        const script = `display dialog "${message}" with title "${title}" buttons ${btns} default button 1 with icon ${iconStr}`;
        try {
            const res = await this.execPromise(`osascript -e '${script}'`);
            // Result: "button returned:OK"
            if (res.includes('button returned:OK')) return 'OK';
            if (res.includes('button returned:Yes')) return 'Yes';
            if (res.includes('button returned:No')) return 'No';
            return 'OK';
        } catch {
            return 'Cancel';
        }
    }

    private async runOsaSelection(title: string, message: string, options: string[], defaultIdx: number): Promise<string> {
        // choose from list {"A", "B"} with prompt "msg" default items {"A"}
        const opts = options.map(o => `"${o}"`).join(', ');
        const def = `"${options[defaultIdx]}"`;
        const script = `choose from list {${opts}} with prompt "${message}" default items {${def}} with title "${title}"`;
        try {
            const res = await this.execPromise(`osascript -e '${script}'`);
            return res === 'false' ? 'Cancel' : res;
        } catch {
            return 'Cancel';
        }
    }

    private async runOsaFolder(desc: string): Promise<string> {
        // choose folder with prompt "desc"
        // Return Posix path
        const script = `set p to POSIX path of (choose folder with prompt "${desc}")`;
        try {
            const res = await this.execPromise(`osascript -e '${script}'`);
            return res;
        } catch {
            return '';
        }
    }

    private runPowerShell(command: string): Promise<string> {
        return new Promise((resolve, reject) => {
            const child = spawn('powershell.exe', ['-NoProfile', '-ExecutionPolicy', 'Bypass', '-Command', command]);

            let stdout = '';
            child.stdout.on('data', (data) => { stdout += data.toString(); });

            child.on('close', (code) => {
                resolve(stdout.trim());
            });

            child.on('error', (err) => reject(err));
        });
    }
}

export const dialogService = new DialogService();
