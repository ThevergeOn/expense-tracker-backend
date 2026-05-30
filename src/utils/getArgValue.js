function getArgValue(argName) {
  const index = process.argv.indexOf(argName);

  if (index === -1) {
    return null;
  }

  return process.argv[index + 1];
}

module.exports = getArgValue;
