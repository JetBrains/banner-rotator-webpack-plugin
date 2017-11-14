/**
 * @see https://github.com/leonardoanalista/cz-customizable#options
 */
module.exports = {
  types: [
    {value: 'feat',     name: 'feat:     A new feature'},
    {value: 'improve',  name: 'improve:  Kind of small feature, but will not trigger a release'},
    {value: 'fix',      name: 'fix:      A bug fix'},
    {value: 'docs',     name: 'docs:     Documentation changes'},
    {value: 'style',    name: 'style:    Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)'},
    {value: 'refactor', name: 'refactor: A code change that neither fixes a bug nor adds a feature'},
    {value: 'perf',     name: 'perf:     A code change that improves performance'},
    {value: 'test',     name: 'test:     Adding missing tests or update existing'},
    {value: 'chore',    name: 'chore:    Changes to the build process or auxiliary tools and libraries such as documentation generation'},
    {value: 'ci',       name: 'ci:       Continuous intergation related changes'},
    {value: 'scripts',  name: 'scripts:  Scripts related changes'},
    {value: 'revert',   name: 'revert:   Revert to a commit'},
    {value: 'WIP',      name: 'WIP:      Work in progress'}
  ],

  /**
   * Specify the scopes for your particular project. Eg.: for some banking system: ["acccounts", "payments"].
   * For another travelling application: ["bookings", "search", "profile"].
   */
  scopes: [],

  /**
   * It needs to match the value for field type.
   * @example
   * scopeOverrides: {
   *   fix: [
   *     {name: 'merge'},
   *     {name: 'style'},
   *     {name: 'e2eTest'},
   *     {name: 'unitTest'}
   *   ]
   * }
   */
  scopeOverrides: {},
  allowCustomScopes: true,
  allowBreakingChanges: ['feat', 'fix'],
  appendBranchNameToCommitMessage: false,
  breakingPrefix: 'BREAKING CHANGE:',
  footerPrefix: 'Closes'
};
