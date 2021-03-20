const buildFilters = ({OR = [], username_contains, tags_contain}) => {
    const filter = (username_contains || tags_contain) ? {} : null;
    if (username_contains) {
      filter.username = {$regex: `.*${username_contains}.*`};
    }
    if (tags_contain) {
      filter.tags = {$regex: `.*${tags_contain}.*`}
    }
  
    let filters = filter ? [filter] : [];
    for (let i = 0; i < OR.length; i++) {
      filters = filters.concat(buildFilters(OR[i]));
    }
  
    return filters;
}

export default { buildFilters };

