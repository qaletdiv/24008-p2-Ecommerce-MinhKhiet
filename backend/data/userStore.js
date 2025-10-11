const { usersData } = require('./users');
let users = [...usersData];
let nextId = Math.max(...users.map(u => u.id)) + 1;

/**
 * @returns {Array} 
 */
const getUsers = () => users;

/**
 * @param {Array} newUsers 
 */
const setUsers = (newUsers) => {
  users = newUsers;
};

/**
 * @returns {number} 
 */
const getNextId = () => nextId++;

/**
 * @param {number|string} userId 
 * @returns {Object|undefined} 
 */
const findUserById = (userId) => {
  return users.find(u => u.id === parseInt(userId));
};

/**
 * @param {number|string} userId 
 * @returns {number} 
 */
const findUserIndex = (userId) => {
  return users.findIndex(u => u.id === parseInt(userId));
};

/**
 * @param {number|string} userId 
 * @param {Object} updates 
 * @returns {Object|null} 
 */
const updateUser = (userId, updates) => {
  const userIndex = findUserIndex(userId);
  if (userIndex === -1) return null;
  
  users[userIndex] = {
    ...users[userIndex],
    ...updates,
    id: parseInt(userId), 
  };
  
  return users[userIndex];
};

module.exports = {
  getUsers,
  setUsers,
  getNextId,
  findUserById,
  findUserIndex,
  updateUser,
};
