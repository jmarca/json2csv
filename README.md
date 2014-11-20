# convert JSON to CSV

Surely a reinvention or unvention, but I need it

# Pass in JSON, get back CSV

If you have a list of things in JSON, then you get back a list of
those things, CSV-ified.

Below the first level of list, everything else is flattened out.

Using the mighty power of wings to get to your pain at supersonic
speeds.


## formally link headers for printing and extracted headers

In my prior effort, I had a look up table so that I could get the
record and print a human-readable header name for that column.  Now it
is important because I sort the records alphabetically to make sure
they line up, and sometimes you might even have a record with null
instead of an actual value if you're pulling from lots of records from
say different files.

So I need a way to specify the headers, both the printed ones and the
embedded ones for extracting. and link the two.

Once possibly useful thing is to just dump the headers to a file, with
the structure built such that the developer can enter in override
names.

``` javascript

headers = [{order:0, key:bar.baz.foo, header:'Foo'},
           {order:1, key:bat.baz.foo},
           {order:2, key:glr.baz.foo, skip:true},
           {order:3, key:glm.baz.foo, header:'Glum'}
]
```

So the initial header would get dumped with just the order and the key
fields filled out, and then a line break.

The top of the file has instructions for adding header row overrides,
and the ability to skip an entry.

Note that this isn't actually used yet.
