const animalController = {
  update: (args, animals) => {
    if (!args.id) {
      if (!args.name) {
        return { success: false, message: 'Name is required' };
      }
      if (!args.ownerId) {
        return { success: false, message: 'Owner ID is required' };
      }
      if (!["1", "2", "3", "4"].includes(args.ownerId)) {
        return {
          success: false,
          message: `There is no owner with ID ${args.ownerId}`
        };
      }

      const id = Math.max(...animals.map(({ id }) => parseInt(id))) + 1;
      const animal = { id: id.toString() };
      for (const field in args) {
        animal[field] = args[field];
      }
      animals.push(animal);
      return { success: true, message: `Animal with ID ${id} was created` };
    }

    const animalToUpdate = animals.find(({ id }) => id === args.id);
    if (!animalToUpdate) {
      return {
        success: false,
        message: `There is no animal with ID ${args.id}`
      };
    }

    for (const field in args) {
      animalToUpdate[field] = args[field];
    }
    return { success: true, message: `Animal with ID ${args.id} was updated` };
  },

  delete: (id, animals) => {
    const index = animals.findIndex(animal => id === animal.id);

    if (index === -1) {
      return {
        success: false,
        message: `There is no animal with ID ${id}`
      };
    }

    animals.splice(index, 1);

    return {
      success: true,
      message: `Animal with ID ${id} was deleted`,
    }
  },
}

module.exports = animalController;
