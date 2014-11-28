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

var cache = {};

ValueSet.load = function (endPoint, codingSystem) {
    var full_endpoint = endPoint + '?ID=' + codingSystem;
    if (full_endpoint in cache) {
	return cache[full_endpoint];
    } else {
	var HwrEndPoint = require(__dirname + '/hwr-end-point');
	var hwr = new HwrEndPoint(full_endpoint);

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
	var res = hwr.load(createValueSet, fallback);
	if (res) {
	    cache[full_endpoint] = res;
	    return res;
	} else {
	    return false;
	}
    }
};

module.exports = ValueSet;