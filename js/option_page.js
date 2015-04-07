$(function(){
  $('.modal-trigger').leanModal();

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
    var $tbody = $tr.parent();
    $tr.addClass("deleting");
    window.setTimeout(function () {
      $tr.remove();
    }, 800);

    if($tr.find(".settings--templateName")[0]) {
      updateTemplateSelectAll();
    }
    var $trs = $tbody.find("tr").not(".template");
    if($trs.length === 1) {
      $trs.find(".btn-remove").remove();
    }
  });
  
  
  $(document).on("blur", ".settings--templateName", function() {
    updateTemplateSelectAll();
  });
  
  $(".btn-save").click(function() {
    var data = {general : [], templates: {}};
    
    $(".settings-genaral").find("> tbody > tr").not(".template").each(function() {
      var generalData = {};
      generalData["repo"] = $(this).find(".settings--repo").val();
      generalData["dispName"] = $(this).find(".settings--dispName").val();
      
      var templates = {};
      $(this).find(".settings-kv").find("tr").not(".template").each(function() {
        templates[$(this).find(".settings--label").val()] = $(this).find(".settings--templateSelect").val();
      });
      generalData["templates"] = templates;
      data.general.push(generalData);
    });
    
    var templateData = {};
    $(".settings-templates").find("tr").not(".template").each(function() {
      templateData[$(this).find(".settings--templateName").val()] = $(this).find(".settings--template").val();
    });
    
    data["templates"] = templateData;
    chrome.storage.sync.set({"github-issue-template": data}, function(){
      toast("Saved.", 2000);
    });
  });
  
  $(".btn-reset").click(function() {
    chrome.storage.sync.clear(function(){
      $(".settings-genaral").find("> tbody > tr").not(".template").each(function() {
        $(this).remove();
      });
      $(".settings-templates").find("> tbody > tr").not(".template").each(function() {
        $(this).remove();
      });
      load(DEFAULT_VALUE["github-issue-template"]);
      toast("Reset", 2000);
    });
  });
  
  function load(data) {
    var $tableGeneral = $(".settings-genaral");
    updateTemplateSelect($tableGeneral.find(".template").find(".settings--templateSelect"), Object.keys(data.templates));
 
    data.general.forEach(function (g) {
      addTr($tableGeneral, function($template) {
        $template.find(".settings--repo").val(g.repo);
        $template.find(".settings--dispName").val(g.dispName);
        var $tableKv = $template.find(".settings-kv");
        var templateKeys = Object.keys(g.templates);
        if(templateKeys.length > 0) {
          templateKeys.forEach(function(k, i) {
            var applyLabelTemplate = function ($template) {
              $template.find(".settings--label").val(k);
              $template.find(".settings--templateSelect").val(g.templates[k]);
            };
            i === 0 ? addTr($tableKv, applyLabelTemplate) : addTrWithRemoveBtn($tableKv, ".btn-addInTr", applyLabelTemplate);
          });
        } else {
          addTr($tableKv);
        }
      });
    });
    
    Object.keys(data.templates).forEach(function(k) {
      addTr($(".settings-templates"), function($template) {
        $template.find(".settings--templateName").val(k);
        $template.find(".settings--template").val(data.templates[k]);
      });
    });
  }
  
  function updateTemplateSelect($select, templateKeys) {
    var val = $select.val();
    $select.find("option:not(:first-child)").each(function(){
      $(this).remove();
    });
    templateKeys.forEach(function(k) {
      var $option = $select.find("option:first-child").clone();
      $option.val(k);
      $option.text(k);
      $option.attr("disabled", false);
      $select.append($option);
    });
    $select.val(val);
  }
  
  function updateTemplateSelectAll() {
    var templateNames = [];
    $("tr:not([class=template]) .settings--templateName").each(function() {
      templateNames.push($(this).val());
    });
    
    $(".settings--templateSelect").each(function() {
      updateTemplateSelect($(this), templateNames);
    });
  }
  
  function addTr($table, callback) {
    var $template = $table.find("> tbody > .template").clone();
    if($table.find("> tbody > tr").not(".template").length === 0) {
      $template.find("> td > .btn-remove").remove();
    }
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
