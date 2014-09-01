describe('Practitioner', function () {
    describe('load_all', function () {
        it('loads all practitioners from a remote end point', function () {
            var all_practitioners = Practitioner.load_all();
            // WIP: Jeff is working on it
            expect(all_practitioners.length).toBe(0);
        });
    });
});