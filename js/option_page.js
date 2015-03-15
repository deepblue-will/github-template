$(function(){
  chrome.storage.sync.get("github-issue-template", function(storageData) {
    var data = DEFAULT_VALUE;
    if(Object.keys(storageData).length > 0){
      data = storageData;
    }
    
    load(data["github-issue-template"]);
  });

  // add line
  $(".btn-add").click(function() {
    addTr($(this).next(), function($template) {
      if($template.find(".settings-kv")[0]) {
        addTr($template.find(".settings-kv"))
      }
    });
  });
  $(document).on("click", ".btn-addInTr", function() {
    var $table = $(this).parent().parent().parent().parent();
    addTrWithRemoveBtn($table, ".btn-addInTr");
  });
  
  // remove line
  $(document).on("click", ".btn-remove", function() {
    var $tr = $(this).parent().parent();
    $tr.remove();
  });
  
  
  $(".btn-save").click(function() {
    var data = {};
    chrome.storage.sync.set(data, function(){
      toast("Saved.", 2000);
    });
  });
  
  $(".btn-reset").click(function() {
    chrome.storage.sync.clear(function(){
      load(DEFAULT_VALUE);
      toast("Reset", 2000);
    });
  });
  
  function load(data) {
    $tableGeneral = $(".settings-genaral");
    updateTemplateSelect($tableGeneral.find(".template").find(".settings--templateSelect"), Object.keys(data.templates));
    data.general.forEach(function (g) {
      addTr($tableGeneral, function($template) {
        $template.find(".settings--repo").val(g.repo);
        $template.find(".settings--dispName").val(g.dispName);
        var $tableKv = $template.find(".settings-kv");
        var templateKeys = Object.keys(data.templates);
        if(templateKeys.length > 0) {
          templateKeys.forEach(function(k, i) {
            var applyLabelTemplate = function ($template) {
              $template.find(".settings--label").val(k);
              $template.find(".settings--templateSelect").val(data.templates[k]);
            };
            i === 0 ? addTr($tableKv, applyLabelTemplate) : addTrWithRemoveBtn($tableKv, ".btn-addInTr", applyLabelTemplate);
          });
        } else {
          addTr($tableKv);
        }
      });
    });
  }
  
  function updateTemplateSelect($select, templateKeys) {
    templateKeys.forEach(function(k) {
      var $option = $select.find("option:first-child").clone();
      $option.val(k);
      $option.text(k);
      $option.attr("disabled", false);
      $select.append($option);
    });
  }
  
  function addTr($table, callback) {
    var $template = $table.find("> tbody > .template").clone();
    if(typeof callback === "function") {
      callback($template);
    }
    
    $table.find("> tbody").append($template);
    $template.addClass('tr-added').removeClass('template');
  }
  
  function addTrWithRemoveBtn($table, btnClass, callback) {
    addTr($table, function($template) {
      $template.find(btnClass).remove();
      if(typeof callback === "function") {
        callback($template);
      }
    });
  }
});
