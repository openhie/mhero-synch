var ValueSet = function (concepts) {
    this.concepts = concepts;

    this.get = function (code) {
        return concepts.filter(function (concept) {
            return concept.code == code;
        })[0];
    };
};

var valueSetCache = valueSetCache || {};

ValueSet.load = function (endPoint, codingSystem) {
    var Q = require('q');
    var deferred = Q.defer();

    if(valueSetCache[codingSystem]) {
        deferred.resolve(valueSetCache[codingSystem]);
    } else {
        var request = require('request');
        request(endPoint + '?ID=' + codingSystem, function (error, response, body) {
            if (error) {
                deferred.reject(error);
                return;
            }

            if (response.statusCode != 200) {
                deferred.reject(body);
                return;
            }

            var parseString = require('xml2js').parseString;
            parseString(body, function (err, result) {
                var rawConcepts = result['svs:RetrieveValueSetResponse']['svs:ValueSet'][0]['svs:ConceptList'][0]['svs:Concept'];
                var allConcepts = rawConcepts.map(function (rawConcept) {
                    return rawConcept['$'];
                });
                var valueSet = new ValueSet(allConcepts);
                valueSetCache[codingSystem] = valueSet;
                deferred.resolve(valueSet);
            });
        });
    }

    return deferred.promise;
};

module.exports = ValueSet;