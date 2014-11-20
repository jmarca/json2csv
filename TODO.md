# TODO

## Autodetect a big block of data.

So in my case, I have a big ass block of data buried inside of some
boilerplate shell that identifies the doc.  It is geojson, so there is
stuff like geometry and what not, then I stuffed a list of time-based
attributes inside it, under features[0].properties.data

So what would be useful would be that when diving down in the data, to
detect when an array is massive, or at teh very least, wider than the
records are tall (I might have 2 or 3 features at most, and 2,000 or
so rows in the "data" array part of it).  In that case, just spit out
the data, with maybe extra columns tacked on for all the other header
rows, rather than a huge horizontal data structure that is one row.

The downside is that the same boilerplate columns are repeated for all
2000+ data rows.  But that is what it is, and anyway, if you go
pulling in thousands of other records from other json files, this
gives you a way to sift them all together in a db or something.
