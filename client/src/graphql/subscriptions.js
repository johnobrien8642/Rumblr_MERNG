import { gql } from '@apollo/client';

const Subscriptions = {
  SUBSCRIBE_USER_DETAILS_COUNTS: gql`
    subscription SubscribeUserDetailsCounts($blogName: String) {
      subscribeUserDetailsCounts(blogName: $blogName) {
        _id
        blogName
        userFollowCount
        postLikeCount
      }
    }
  `
}

export default Subscriptions;