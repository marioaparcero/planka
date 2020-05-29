const Errors = {
  PROJECT_NOT_FOUND: {
    projectNotFound: 'Project not found',
  },
};

module.exports = {
  inputs: {
    id: {
      type: 'string',
      regex: /^[0-9]+$/,
      required: true,
    },
    name: {
      type: 'string',
      isNotEmptyString: true,
    },
    // TODO: add validation
    background: {
      type: 'json',
    },
    backgroundImage: {
      type: 'json',
      custom: (value) => _.isNull(value),
    },
  },

  exits: {
    projectNotFound: {
      responseType: 'notFound',
    },
  },

  async fn(inputs, exits) {
    let project = await Project.findOne(inputs.id);

    if (!project) {
      throw Errors.PROJECT_NOT_FOUND;
    }

    const values = _.pick(inputs, ['name', 'background', 'backgroundImage']);

    project = await sails.helpers.updateProject(project, values, this.req);

    if (!project) {
      throw Errors.PROJECT_NOT_FOUND;
    }

    return exits.success({
      item: project,
    });
  },
};
