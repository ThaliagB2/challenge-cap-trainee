import * as fs from 'fs';
import * as path from 'path';

const filePath = path.join(process.cwd(), 'srv', 'csn.json');

interface JsonData {
    definitions: {
        {{UpperCamelCaseAppName}}: {
            '@source': string;
        };
    };
}

function updateSourceInJsonSync(): void {
    try {
        const data: string = fs.readFileSync(filePath, 'utf8');
        const jsonData: JsonData = JSON.parse(data);
        if (jsonData.definitions.{{UpperCamelCaseAppName}}['@source'] === '{{app-name}}/src/main/routes/index.cds') {
            jsonData.definitions.{{UpperCamelCaseAppName}}['@source'] = 'srv/src/main/routes/index.cds';
        }
        const updatedJson: string = JSON.stringify(jsonData, null, 2);
        fs.writeFileSync(filePath, updatedJson, 'utf8');
    } catch (ignored) {
        // console.error('Erro ao processar o arquivo:', err);
    }
}

updateSourceInJsonSync();
