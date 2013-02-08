define(['js/data/Entity', 'text/type/Style', 'underscore'], function (Entity, Style, _) {
    var undefined;
    return Entity.inherit('text.entity.FlowElement', {
        defaults: {
            text: "",
            style: Style
        },

        isLeaf: false,

        text: function (relativeStart, relativeEnd, paragraphSeparator) {
            if (relativeEnd === -1) {
                relativeEnd = undefined;
            }

            return this.$.text.substring(relativeStart, relativeEnd);
        },

        textLength: function () {
            return this.$.text.length;
        }.onChange("text"),

        hasSameStyle: function (flowElement) {
            return this.$.style.isDeepEqual(flowElement.$.style);
        },

        applyStyle: function (style) {
            if (style instanceof Style) {
                this.$.style.set(style.$);
            } else {
                this.$.style.set(style);
            }
        },

        composeStyle: function(){
            return this.$.style ? this.$.style.compose() : {};
        },

        getComputedStyle: function(){
            var parent = this.$parent,
                style = this.composeStyle();

            while(parent){
                _.defaults(style, parent.composeStyle());
                parent = parent.$parent;
            }

            return style;
        }

    });

});