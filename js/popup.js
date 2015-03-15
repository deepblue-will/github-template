$(function(){
  GITHUB_ISSUE_URL = "https://github.com/{repo}/issues/new?labels={label}&body={body}&assignee={assignee}";

  $(".menu--btn").on('click', function(){
    $menuItem = $(this).parents(".menu--item");
    
    repo = $menuItem.find(".menu--repoName").text();
    label = $menuItem.find(".menu--labelSelect").val();
    body = encodeURIComponent("## 概要¥n¥n## 詳細¥n¥n## 関連するissue¥n¥n");
    assignee = "deepblue-will";
    
    url = GITHUB_ISSUE_URL.replace("{repo}", repo).replace("{label}", label).replace("{body}", body).replace("{assignee}", assignee);
    
    chrome.tabs.create({url: url});
  });
});
