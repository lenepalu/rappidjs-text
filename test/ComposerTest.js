var expect = require('chai').expect,
    _ = require('underscore'),
    testRunner = require('rAppid.js').TestRunner.setup();

var C = {};

describe('Composer', function () {

    var measurer = null;

    before(function (done) {
        testRunner.requireClasses({
            TextFlow: 'text/entity/TextFlow',
            Span: 'text/entity/SpanElement',
            Paragraph: 'text/entity/ParagraphElement',
            FlowGroupElement: 'text/entity/FlowGroupElement',
            FlowLeafElement: 'text/entity/FlowLeafElement',
            MeasurerMock: 'test/mock/MeasurerMock',
            TextRange: "text/entity/TextRange",
            ApplyStyleToElementOperation: 'text/operation/ApplyStyleToElementOperation',
            Style: "text/type/Style",
            Composer: "text/composer/Composer",
            Layout: "text/entity/Layout"
        }, C, done);

    });

    beforeEach(function () {
        measurer = new C.MeasurerMock()
    });

    var helper = {

        createTextFlow: function (text, style, paragraphStyle) {
            style = style || new C.Style({
                fontSize: 12
            });

            var flow = C.TextFlow.initializeFromText(text),
                operation = new C.ApplyStyleToElementOperation(
                    C.TextRange.createTextRange(0, flow.textLength()),
                    flow, style, paragraphStyle);

            operation.doOperation();

            return flow;
        }

    };

    describe('mock', function () {

        it("should return the length of the font in dependency of the text length", function () {

            var flow = helper.createTextFlow("foo");

            expect(flow.numChildren()).to.be.eql(1);

            var metric = measurer.measure(flow.$.children.at(0).$.children.at(0));
            expect(metric.$.width).to.be.eql(36);
            expect(metric.$.height).to.be.eql(12);

        });

    });

    describe('composer', function () {

        var composer = null,
            flow,
            longText = "This is a long text, but the container isn't that large.";

        before(function() {
            composer = new C.Composer(measurer);
        });

        beforeEach(function() {
            flow = helper.createTextFlow(longText);
        });

        it("should not break text", function () {

            var composed = composer._composeText(flow.$.children.at(0));

            expect(composed.$.lines).to.have.length(1);
            expect(composed.$.lines[0].measure.lineHeight).to.eql(12);

        });

        it("should determinate the height of the line based on the largest inline element", function () {

            (new C.ApplyStyleToElementOperation(C.TextRange.createTextRange(0, 3), flow, {
                fontSize: 36,
                lineHeight: 2
            })).doOperation();

            (new C.ApplyStyleToElementOperation(C.TextRange.createTextRange(10, 3), flow, {
                fontSize: 8,
                lineHeight: 10
            })).doOperation();

            var composed = composer._composeText(flow.$.children.at(0));

            expect(flow.$.children.$items).to.have.length(1);
            expect(flow.$.children.at(0).$.children.$items).to.have.length(3);

            expect(composed.$.lines).to.have.length(1);
            expect(composed.$.lines[0].measure.height).to.eql(36);
            expect(composed.$.lines[0].measure.lineHeight).to.eql(80);

        });

        it.skip("should break text into lines", function() {

        });

        it.skip("should determinate the line height based on the max text height on the line", function() {

        });

    });

});