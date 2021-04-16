"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story) {
  // console.debug("generateStoryMarkup", story);

  const hostName = story.getHostName();
  return $(`
      <li id="${story.storyId}">
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
}

/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}


//On submission of form, trigger submission event. 
$('#submission-form').on("submit", storySubmissionEvent);

//obtains data from story submission form, calls addStory() to create a new story, and adds it to the page. 
async function storySubmissionEvent (evt) {
  console.debug("storySubmissionEvent", evt);
  evt.preventDefault();

  const submissionAuthorName = $("#author-name").val();
  const submissionTitle = $("#title-name").val();
  const submissionURL = $("#url-input").val();

  let addedStory = await storyList.addStory(currentUser, {title: submissionTitle, author: submissionAuthorName, url: submissionURL});
  let $addedStory = generateStoryMarkup(addedStory)
  $allStoriesList.prepend($addedStory)

  $('#submission-form').hide()

}

//** If a user submits the submission form, hides submission form, gets updated storyList & puts updated storylist on page */
// $('#submission-form').on("submit", submitStory)

// async function submitStory(evt) {
//   console.debug("submitStory", evt);
//   hidePageComponents();
//   await StoryList.getStories();
//   putStoriesOnPage();
// }