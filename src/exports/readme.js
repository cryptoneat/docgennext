function readme(title, description) {
return `# ${title}

${description}

## Compilation de votre documentation

Avec un Terminal, placez-vous dans le projet documentaire et lancez la commande suivante :

\`\`\`bash
npm run start
\`\`\`

À la racine du projet, dans le fichier \`package.json\` se trouve le champs \`config/confirm\`. Si cette valeur est à \`true\`, votre navigateur Internet par défaut est lancé automatiquement. Dans le cas contraire, vous devez ouvrir le navigateur de votre choix.

## Dossier \`build/\`

Au moment de la création de votre projet, un dossier \`build/\` est créé à la racine du projet. Ce dossier n'est pas suivi par \`git\`, ne mettez pas vos fichiers originaux dans celui-ci. Utilisez uniquement le dossier \`project/\`, dans un des sous-dossiers dédiés, en fonction des cas (dossier \`icons/\` pour vos icônes, dossier \`images/\` pour vos images, etc.)

Si vous modifiez régulièrement les sous-dossier de \`project/\`, pensez de temps en temps à supprimer le dossier \`build/\` pour faire le ménage.

## Génération PDF
`}

module.exports = readme;
