const GITHUB_ISSUE_URL = "https://github.com/{repo}/issues/new?labels={label}&body={body}";
$(function(){
  var data = DEFAULT_VALUE;

  chrome.storage.sync.get("github-issue-template", function (storageData) {
    if (Object.keys(storageData).length > 0) {
      data = storageData;
    }
    load(data["github-issue-template"]);
  });

  function load(data) {
    var general = data.general;

    general.forEach(function (g) {
      var $template = $(".menu--item-template").clone().removeClass("menu--item-template");
      $template.find(".menu--dispName").text(g["dispName"]);
      $template.find(".menu--repoName").val(g["repo"]);
      Object.keys(g.templates).forEach(function (k) {
        var $option = $template.find(".menu--labelSelect option:first-child").clone();
        $option.val(g.templates[k]);
        $option.text(k);
        console.log("aa");
        $template.find(".menu--labelSelect").append($option);
      });

      $(".menu").append($template)
    })
  }


  $(document).on('click', ".menu--btn", function () {
    var $menuItem = $(this).parents(".menu--item");

    var repo = $menuItem.find(".menu--repoName").val();
    var label = $menuItem.find(".menu--labelSelect").val() || "";
    var body = "";
    if (label) body = encodeURIComponent(data["github-issue-template"].templates[label]);

    var url = GITHUB_ISSUE_URL.replace("{repo}", repo).replace("{label}", label).replace("{body}", body);

    chrome.tabs.create({url: url});
  });
});
