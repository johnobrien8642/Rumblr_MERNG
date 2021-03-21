
const buildFilters = ({OR = [], blogName_contains, tags_contain}) => {
    const filter = (blogName_contains || tags_contain) ? {} : null;
    if (blogName_contains) {
      filter.blogName = new RegExp(`${blogName_contains}`);
    }
    if (tags_contain) {
      filter.tags = new RegExp(`${tags_contain}`)
    }
  
    let filters = filter ? [filter] : [];
    for (let i = 0; i < OR.length; i++) {
      filters = filters.concat(buildFilters(OR[i]));
    }
    
    return filters;
}

export default { buildFilters };

