var ValueSet = function (concepts) {
    this.get = function (code) {
        if(!concepts) {
            return null;
        }

        return concepts.filter(function (concept) {
            return concept.code == code;
        })[0];
    };
};

ValueSet.load = function (endPoint, codingSystem) {
    var HwrEndPoint = require(__dirname + '/hwr-end-point');
    var hwr = new HwrEndPoint(endPoint + '?ID=' + codingSystem);

    var createValueSet = function(result) {
        var rawValueSet = result['svs:RetrieveValueSetResponse']['svs:ValueSet'];
        if(!rawValueSet) {
            throw 'invalid';
        }

        var rawConcepts = rawValueSet[0]['svs:ConceptList'][0]['svs:Concept'];
        var allConcepts = rawConcepts.map(function (rawConcept) {
            return rawConcept['$'];
        });
        return new ValueSet(allConcepts);
    };
    var fallback = new ValueSet();

    return hwr.load(createValueSet, fallback);
};

module.exports = ValueSet;