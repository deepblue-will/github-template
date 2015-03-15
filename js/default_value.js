const DEFAULT_VALUE = {
  "github-issue-template": {
    general: [
      {
        repo: "deepblue/github-template",
        dispName: "github-template",
        templates : {
          feature: "feature",
          bug: "bug"
        }
      }
    ],
    templates: {
      feature: "## 概要¥n¥n ## 期待する動作¥n¥n## 関連するissue¥n¥n",
      bug: "## 概要¥n¥n ## 再現手順¥n¥n## ログ¥n¥n## 修正方法¥n¥n## 関連するissue¥n¥n"
    }
  }
}
