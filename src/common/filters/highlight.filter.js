function () {
    /**
    * @ngdoc filter
    * @description remove html tags
    * @usage
    * <p ng-bind-html="article.body | dcCommonStriptags | dcCommonHighlight:search"></p>
    *
    */
    return function highLight(str, highlight) {
        if (undefined === str) {
            return str;
        }

        if (highlight !== undefined && highlight !== '') {
            var strippedString = str.replace(/(<([^>]+)>)/gi, '');
            var rgxp = new RegExp("(" + highlight.replace(' ', '|') + ")", 'ig');
            var repl = '<span class="highlight">$1</span>';
            str = strippedString.replace(rgxp, repl);
        }

        return str;
    };
}
