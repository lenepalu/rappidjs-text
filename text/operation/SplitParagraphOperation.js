define(['text/operation/SplitElementOperation','text/entity/ParagraphElement'], function (SplitElementOperation, ParagraphElement) {
    return SplitElementOperation.inherit('text.operation.SplitParagraphOperation', {

        ctor: function (textRange, target) {
            this.callBase(textRange, target || textRange.$.textFlow);
        },

        doOperation: function () {
            this.callBase();
            var newParagraph = new ParagraphElement();

            if (this.$newElement) {
                var
                    leaf = this.$newElement,
                    paragraph = leaf.$parent,
                    currentLeaf = this.$newElement;
                // no need to split up leaf
                while (leaf) {
                    currentLeaf = leaf;
                    leaf = currentLeaf.getNextLeaf(paragraph);
                    paragraph.removeChild(currentLeaf);
                    newParagraph.addChild(currentLeaf);
                }
                this.$previousParagraph = paragraph;
                this.$newElement = newParagraph;

                var paragraphParent = this.$previousParagraph.$parent;
                if (paragraphParent) {
                    var paragraphIndex = paragraphParent.getChildIndex(this.$previousParagraph);
                    paragraphParent.addChild(this.$newElement, {index: paragraphIndex + 1});
                }
            }
        }


    });

});