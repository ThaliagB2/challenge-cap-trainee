#!/usr/bin/env node

const fs = require('fs');
const readline = require('readline');

function askAppName() {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    return new Promise((resolve) => {
        rl.question('Digite o nome do serviço (com traços, ex: meu-servico): ', (answer) => {
            rl.close();
            resolve(answer.trim() || 'sample-service');
        });
    });
}

function askSchemaName() {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    return new Promise((resolve) => {
        rl.question('Digite o nome do schema (ex: SAMPLE_SCHEMA): ', (answer) => {
            rl.close();
            resolve(answer.trim() || 'SAMPLE_SCHEMA');
        });
    });
}

function removeHyphens(name) {
    return name.replace(/-/g, '');
}

function toUpperCamelCase(name) {
    return name
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join('');
}

function replaceInFile(filePath, searchValue, replaceValue) {
    if (!fs.existsSync(filePath)) {
        console.log(`Arquivo não encontrado: ${filePath}`);
        return;
    }

    const content = fs.readFileSync(filePath, 'utf8');
    const newContent = content.replace(new RegExp(searchValue, 'g'), replaceValue);
    
    if (content !== newContent) {
        fs.writeFileSync(filePath, newContent, 'utf8');
        console.log(`✓ Atualizado: ${filePath}`);
    }
}

function renameDirectory(oldPath, newPath) {
    if (fs.existsSync(oldPath)) {
        fs.renameSync(oldPath, newPath);
        console.log(`✓ Diretório renomeado: ${oldPath} → ${newPath}`);
    }
}

async function setupTemplate() {
    console.log('🚀 Configurando template SAP BTP React Application\n');
    
    const appName = await askAppName();
    const schemaName = await askSchemaName();
    const appNameWithoutDash = removeHyphens(appName);
    const upperCamelCaseAppName = toUpperCamelCase(appName);
    
    if (appName === 'sample-app') {
        console.log('Nome mantido como "sample-app". Nenhuma alteração necessária.');
        return;
    }

    console.log(`\n📝 Configurando aplicação:`);
    console.log(`   - Nome com traços: ${appName}`);
    console.log(`   - Nome sem traços: ${appNameWithoutDash}`);
    console.log(`   - Nome UpperCamelCase: ${upperCamelCaseAppName}`);
    console.log(`   - Schema name: ${schemaName}\n`);

    const filesToUpdate = [
        'package.json',
        'mta.yaml',
        '.cdsrc.json',
        'sample-service/package.json',
        'sample-service/src/main/scripts/replace-csn-source.ts',
        'sample-service/src/main/routes/index.cds',
        'sample-service/tsconfig.json'
    ];

    if (fs.existsSync('sample-service')) {
        renameDirectory('sample-service', appName);
    }

    filesToUpdate.forEach(file => {
        let actualFile = file;
        if (file === 'sample-service/package.json') {
            actualFile = `${appName}/package.json`;
        }
        if (file === 'sample-service/src/main/scripts/replace-csn-source.ts') {
            actualFile = `${appName}/src/main/scripts/replace-csn-source.ts`;
        }
        if (file === 'sample-service/src/main/routes/index.cds') {
            actualFile = `${appName}/src/main/routes/index.cds`;
        }
        if (file === 'sample-service/tsconfig.json') {
            actualFile = `${appName}/tsconfig.json`;
        }

        replaceInFile(actualFile, '{{app-name}}', appName);
        replaceInFile(actualFile, '{{app-name-without-dash}}', appNameWithoutDash);
        replaceInFile(actualFile, '{{UpperCamelCaseAppName}}', upperCamelCaseAppName);
        replaceInFile(actualFile, '{{schema-name}}', schemaName);
    });

    console.log(`\n✅ Template configurado com sucesso!`);
    console.log(`📁 Aplicação: ${appName}`);
    console.log(`📊 Schema: ${schemaName}`);
    console.log(`\n🔧 Próximos passos:`);
    console.log(`1. cd ${appName}`);
    console.log(`2. yarn install`);
    console.log(`3. yarn dev`);
    console.log(`\n📄 Para deployment: yarn build`);
    
    setTimeout(() => {
        fs.unlinkSync(__filename);
        console.log(`\n🧹 Script de configuração removido.`);
    }, 1000);
}

if (require.main === module) {
    setupTemplate().catch(console.error);
}

module.exports = { setupTemplate };