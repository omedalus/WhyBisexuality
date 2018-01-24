# WhyMultiSexes

An exploration of the evolution of multiple sexes in sexual reproduction.

by Mikhail Voloshin and Paul C. Bogdan.
Forked from Paul's WhyBisexuality in order to migrate to Angular 5.0.


BUT WHY NOT JUST SPERM->SPERM


## Summary





Sexual reproduction has well-known advantages over its more primitive asexual equivalent, but the evolution of multiple sexes broaches a paradox of irreducibility. We ask whether having two or more gamete types (i.e. a binary mating system) confers an advantage over a hypothetical single-gamete reproductive strategy. In the context of proposing an answer to this question, we note that many species have one sex that is effectively haploid in at least one chromosome (the sex chromosome, naturally). We therefore hypothesize that having a two-sex population in which one sex is (at least partially) haploid and the other diploid, and the two sexes must breed with one another, performs better than a single-sex species in which any individual can mate with any other; and, furthermore, that the reason for this improved performance involves an emergent hill-climbing strategy in which the haploid sex experiments with new positions in the phenotypic solution space while the diploid sex retains the best solution found thus far. This project runs a model that tests this hypothesis by running a literal evoliutionary algorithm with various combinations of haploid and diploid populations.

## Background

It's been long established that sexual reproduction is advantageous to a species because it shuffles the species' genome, conferring rapid adaptation to new survival pressures as well as fault tolerance against deleterious mutations. Citations for this statement seem almost silly; it's been a keystone of biological science since at least 1885, when August Weismann published, "The Continuity of the Germ-Plasm as the Foundation of a Theory of Heredity". Refinements have been made since Weismann's original inception, such as the Red Queen Hypothesis (Van Valen 1973), but the general principle has remained rather straightforward.

However, the existence of sexual reproduction introduces a number of paradoxes ([_The Sex Paradox_](https://www.the-scientist.com/?articles.view/articleNo/40333/title/The-Sex-Paradox/). "The Scientist". July 1, 2014). Among these paradoxes is why multiple gamete types exist. A reproduction strategy with a single gamete type would confer a much larger pool of reproductive partners to each member of a species. Moreover, the existence of single-gamete-type reproduction strategies would seem to be a logical prerequisite to the evolution of the multiple-gamete-type strategies that seem ubiquitous throughout all known multicellular life. Yet unary gamete types don't appear to exist in nature, which implies that binary (or n-ary) gamete types are so much more advantageous over unary types that unaries don't have a "fighting chance".

### Current ubiquitous paradigm: two or more gamete types

In all sexually reproducing organisms on Earth, sexual reproduction occurs via the fusing of two different gamete types. Sexually reproducing species delineate into isogamous or anisogamous types, but both cases are defined by the existence of at least two gamete types that must fuse heterogeneously.

In anisogamous species such as animals (i.e. humans, the model best familiar to non-technical readers), organisms reproduce by having a spermatozoon fuse with an ovum. Naturally, a sperm cannot fuse with another sperm, and an egg cannot fuse with another egg. 

There exist hermaphroditic species whose individuals produce both eggs and sperm &mdash; indeed, in the natural world, such species are quite common, particularly in benthic environments. Such species are capable of self-fertilization (i.e. one of the individual's sperm fuses with one of the same individual's eggs); this is not desirable from the perspective of genetic recombination, but permits a population to propagate even if reduced to a single extant specimen. However, self-fertilization still involves the fusion of an egg with a sperm, not an egg with an egg or a sperm with a sperm; even though both gametes come from the same individual, from the perspective of the gametes themselves, the haploid cells still fuse with heterogenous types.

In isogamous species such as algae, both gamete types are morphologically interchangeable. In effect, both gamete types resemble both ova and sperm; they are massive like an ovum, but motile like a spermatozoon. Under a microscope, the two gamete types are visually and behaviorally indistinguishable &mdash; they look like flagellated ova that swim around and bump into one another. In effect, in isogamous species, the gamete types are perfectly symmetrical. However, they nonetheless retain a chemical signature that delineates them into two or more distinct categories. For example, a species might have gametes of type "+" and type "-"; this is *not* mappable to "eggs" and "sperm" because both "+" and "-" gametes have properties of both eggs and sperm. However, in such a species, "+" gametes can only fuse with "-" gametes and vice versa. Viewed under a microscope, this can be seen as each gamete bouncing dejectedly off of half of its Brownian encounters and fusing with the other half. 

#### Paradoxicality (and lack of advantage) of the existing paradigm

##### Reduction of viable partnership

If each gamete wasn't restricted to half of the population of all other gametes, then every encounter between one gamete and another would result in a viable diploid offspring. Motile gametes expend enormous energy to travel to a fusable partner; when only half of all gametes are fusable, this means that half of all gametes waste their energy traveling to a non-viable partner; half of all remaining gametes waste half of their remaining energy traveling to another non-viable partner; and so on. The production of gametes in the first place could be made much cheaper if there was some guarantee that the first other gamete encountered by a gamete would result in a fertilization. The division of gametes into multiple classes seems, prima facea, to dramatically increase the amount of time and energy that a motile gamete would need to spend to search for a fusible partner, and therefore seems to be evolutionarily disadvantageous.









### Remaining to flesh out

Intro content:
Introduce with Maynard Smith and two-fold cost of sex…

Sexuality improves adaption to more complex environments:
Luijckx, P., Ho, E. K. H., Gasim, M., Chen, S., Stanic, A., Yanchus, C., ... & Agrawal, A. F. (2017). Higher rates of sex evolve during adaptation to more complex environments. Proceedings of the National Academy of Sciences, 114(3), 534-539.

“Our results [on some birds] show that sex-linked genetic variance was modest:”
Husby, A., Schielzeth, H., Forstmeier, W., Gustafsson, L., & Qvarnström, A. (2013). Sex chromosome linked genetic variance and the evolution of sexual dimorphism of quantitative traits. Evolution, 67(3), 609-619.

Agarwal: If deleterious mutations affect males more than females then the existence of males lowers the deleterious equilibrium frequency.
Agrawal, A. F. (2001). Sexual selection and the maintenance of sexual reproduction. Nature, 411(6838), 692.

Discussion content:
 	The HSH is one explination for the evolution of haploid-diploid (cite), but it fails to stand up to evidence (cite next two):
"The haploid susceptibility hypothesis (HSH) was proposed as an explanation for how behavioral roles in haplodiploid social systems evolved. It posits that haploid males are more susceptible to disease than diploid females due to decreased genetic variability at key disease resistance loci. The resulting decreased immunocompetence is hypothesized to have played a role in the evolution of social behavior by limiting the behavioral repertoire haploids perform..." Results of this study DO NOT support the HSH:

Wilson-Rich, N., Pilowsky, J. A., Foo, B., Tien, T., Hester, F., & Starks, P. T. (2014). A test of the haploid susceptibility hypothesis using a species with naturally occurring variation in ploidy. Insectes sociaux, 61(2), 163-169.

These results also DO NOT support the HSH:

Ruiz-González, M. X., & Brown, M. J. (2006). Males vs workers: testing the assumptions of the haploid susceptibility hypothesis in bumblebees. Behavioral Ecology and Sociobiology, 60(4), 501-509.
