# Optional elements

There are some special markdown elements frequently used by the community that are a little outside the usual markdown syntax family: floating content using `<aside>`, and supporting citations near blockquotes using `<cite>`.

## Asides

na aliqua. Ultricies mi et, consecteore et dolore magna aliqua. Ultricies mi quis hendrerit dolor magna. Massa eget egestas.

<aside>this is an aside using <code>&lt;aside&gt;</code>. Note that *markdown* formatting does not work in this kind of block. Eleanor recommends against putting these in the middle of a paragraph.</aside>

Lordunt ut labore et dolore magna aliqua. Ultricies mi quis hendrerit dolor magna. Massa eget %% test %% egestas.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed dopor incididua. Ultricies mi quis hendrerit dolor magna. Massa eget egestas.

### Alternate aside using `<s...><\/s>`

An alternate form of aside uses the strikethrough element, as that allows markdown within the block to function as normal.

<s class="aside-right">this is an aside using `<s class="aside-right">`. Note that *markdown* formatting works in this kind of block. Eleanor recommends against putting these in the middle of a paragraph.</s>

Sed posuere eu nisl et consectetur. Curabitur dignissim, nisl eu blandit scelerisque, tortor elit bibendum augue, ut scelerisque dui quam elementum velit. Nunc ullamcorper purus non ex condimentum, id porttitor diam pharetra. 

<s class="aside-left">this is an aside using `<s class="aside-left">`. Note that *markdown* formatting works in this kind of block. Eleanor recommends against putting these in the middle of a paragraph.</s>

Integer ac accumsan lacus, sed varius erat. Proin mollis felis quis elementum consequat. Etiam faucibus congue arcu et finibus. Duis efficitur ipsum eget feugiat ullamcorper. Proin sed porta lectus, vitae cursus felis. Nulla at nibh nibh. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse efficitur malesuada dolor et feugiat. 

## Blockquotes with Citations

> Nunc non lacus enim. Donec id doliam lurta orci, eget commodo est euismod a. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae;
> <div></div>
> 
> <cite>— by [[Embeds|Internal Link]]</cite>

And another (just a name)

> Nunc non lacus enim. Donec id doliam lurta orci, eget commodo est euismod a. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae
> <cite>— @Eleanor</cite>

And another (external link, note specific href)

> Nunc non lacus enim. Donec id doliam lurta orci, eget commodo est euismod a. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae
> <cite>— <a href="https://twitter.com/obsdmd/status/1458523572448727051?s=20">@obsdmd</a></cite>


## Rendered examples

The Sanctum theme, as an example, renders asides in this way (and supports [a few other variants as well](https://github.com/jdanielmourao/obsidian-sanctum/blob/main/documentation/Theme_Guide.md))
	
> ![[Sanctum-asides.png|600]] <cite>Sanctum</cite>
%% next %%	
	
> ![[Sanctum-citations.png|600]] <cite>Sanctum</cite>
%% next %%

> ![[Sanctum-lightmode-aside-citation.png|600]] <cite>Sanctum</cite>
%% next %%



> ![[ITS-citations.png|600]] <cite>ITS Theme</cite>
%% next %%
