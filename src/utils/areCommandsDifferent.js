const deepDiff = require('deep-diff').diff; // Install deep-diff package

module.exports = (existingCommand, localCommand) => {
  // Function to debug and print differences
  const printDifferences = (existingData, localData) => {
    const differences = deepDiff(existingData, localData);
    if (differences) {
      console.log('Differences found between existing and local data:');
      differences.forEach(diff => {
        console.log(`Field: ${diff.path.join('.')} | Type: ${diff.kind}`);
        console.log(`  Old Value:`, diff.lhs);
        console.log(`  New Value:`, diff.rhs);
        console.log('---');
      });
    } else {
      console.log('No differences found!');
    }
  };

  // Compare the raw command data
  const existingData = {
    name: existingCommand.name,
    description: existingCommand.description,
    name_localizations: existingCommand.name_localizations || undefined,
    description_localizations: existingCommand.description_localizations || undefined,
    contexts: existingCommand.contexts || undefined,
    default_permission: existingCommand.default_permission || undefined,
    permissionsRequired: existingCommand.permissionsRequired || undefined,
    botPermissions: existingCommand.botPermissions || undefined,
    dm_permission: existingCommand.dm_permission || undefined,
    integration_types: existingCommand.integration_types || undefined,
    nsfw: existingCommand.nsfw || undefined,
    arguments: existingCommand.arguments || [],
    options: existingCommand.options?.map(o => ({
      name: o.name,
      description: o.description,
      type: o.type,
      required: o.required || false,
      choices: o.choices || [],
      autocomplete: o.autocomplete || undefined,
      max_length: o.max_length || undefined,
      min_length: o.min_length || undefined
    })) || []
  };

  const localData = {
    name: localCommand.data.name,
    description: localCommand.data.description,
    name_localizations: localCommand.data.name_localizations || undefined,
    description_localizations: localCommand.data.description_localizations || undefined,
    contexts: localCommand.data.contexts || undefined,
    default_permission: localCommand.data.default_permission || undefined,
    permissionsRequired: localCommand.data.permissionsRequired || undefined,
    botPermissions: localCommand.data.botPermissions || undefined,
    dm_permission: localCommand.data.dm_permission || undefined,
    integration_types: localCommand.data.integration_types || undefined,
    nsfw: localCommand.data.nsfw || undefined,
    arguments: localCommand.data.arguments || [],
    options: localCommand.data.options?.map(o => ({
      name: o.name,
      description: o.description,
      type: o.type,
      required: o.required || false,
      choices: o.choices || [],
      autocomplete: o.autocomplete || undefined,
      max_length: o.max_length || undefined,
      min_length: o.min_length || undefined
    })) || []
  };

  // Debugging: Print differences between existing and local data
  printDifferences(existingData, localData);

  // Return if they are different
  return JSON.stringify(existingData) !== JSON.stringify(localData);
};
