---
title: "Missile defense is NP-complete"
date: "2026-03-24"
excerpt: "Exploring the Weapon-Target Assignment problem: how missile defense connects to NP-completeness, SSPK probability calculations, and how saturation attacks exploit computational limits."
tags: ["Gündem", "Hacker News", "Developer"]
category: "Gündem"
---

![Missile defense is NP-complete](/images/two_interceptors_one_warhead.gif)

> **Kaynak:** Hacker News  &nbsp;·&nbsp;  **Puan:** 173

**Exploring the Weapon-Target Assignment problem: how missile defense connects to NP-completeness, SSPK probability calculations, and how saturation attacks exploit computational limits.**

The latest conflict in the Middle East has brought missile defense back into the spotlight. There’s a lot of discussion regarding interceptor stockpiles, missile stockpiles, and cost. As it turns out, this is a resource allocation problem. The problem is NP-complete, but that’s far from the reason why missile defense is a hard problem. To get our bearings, we start with how unreliable a single interceptor actually is.

Single Shot Probability of Kill (SSPK) is the probability that an individual interceptor successfully intercepts one warhead in a single engagement. It captures sensor accuracy, guidance precision, interceptor quality, etc. For example, the U.S. Ground-Based Midcourse Defense (GMD) system uses Ground-Based Interceptors (GBIs) with an estimated SSPK of roughly 56%, based on the system’s intercept test record [3]. Each GBI costs approximately $75 million, and as of 2024, 44 are deployed across Alaska and California [3].

First and foremost, let’s assume that interceptor failures are independent . That is, one interceptor missing doesn’t affect whether another is able to achieve a successful hit.

Now, we can compute the probability of at least one interceptor successfully knocking out an incoming nuclear warhead.

If you fire n n n interceptors independently, the probability that all of them miss is:

Therefore the probability that at least one interceptor kills the target is:

s s p k = 0.56 sspk = 0.56 ss p k = 0.56 and n = 4 n = 4 n = 4 , which gives us

## SSPK: How good is a single interceptor?

Note that the independence assumption is optimistic and may not reflect reality. If interceptor failures are correlated (e.g., all interceptors rely on the same tracking data and misidentify a decoy as the real warhead), the actual probability of successful intercept will be lower than what this formula predicts.

Hence, for one warhead, a defender can launch 4 4 4 interceptors and have a 96% chance of successfully intercepting the incoming warhead.

You can’t hit what you can’t see. The formula P ( kill ) = 1 − ( 1 − s s p k ) n P(\text{kill}) = 1 - (1 - sspk)^n P ( kill ) = 1 − ( 1 − ss p k ) n assumes you’ve already successfully detected the incoming warhead, tracked it with enough precision to commit an interceptor, correctly classified it as a real warhead (i.e., not a decoy), and that your command &#x26; control systems are functional. In reality, all of these steps can fail. In that case, it doesn’t matter how many more interceptors you are willing to expend.

Wilkening (1998) formalizes this concept with a probability P ( track ) P(\text{track}) P ( track ) that captures the entire detection-tracking-classification-command&#x26;control pipeline [5]. The comprehensive kill probability becomes:

This is a common mode factor. That is, if the target is never detected or is misclassified as debris, then every interceptor assigned to it fails. The independence assumption from the previous section is conditional upon successful tracking.

Here’s what the kill probability table looks like when P ( track ) &#x3C; 1 P(\text{track}) &#x3C; 1 P ( track ) &#x3C; 1 :

At P ( track ) = 0.90 P(\text{track}) = 0.90 P ( track ) = 0.90 , the “96% kill probability” with 4 interceptors drops to under 87%. Even an allocation of 5 interceptors reaches only 89%, still short of what the idealized model achieves with just 3.

## P ( track ) P(\text{track}) P ( track ) : What SSPK Doesn’t Capture

Wilkening’s analysis shows that for national missile defense to achieve 80% confidence of destroying all warheads against even modest attacks (4–20 reentry vehicles), you need P ( track ) > 0.978 P(\text{track}) > 0.978 P ( track ) > 0.978 . Below that threshold, no amount of SSPK improvement is sufficient. This is an extraordinarily high bar — the entire pipeline (i.e., detection, tracking, classification, etc.) must work nearly perfectly, nearly every time.

Hence, the probabilities of successful interception in the previous section are best case. The effective kill probability in the real world is always lower, because P ( track ) P(\text{track}) P ( track ) is always less than 1.

And P ( track ) P(\text{track}) P ( track ) is not just passively less than 1 1 1 — an adversary will actively try to drive it toward zero. Recent events have demonstrated this directly. Namely, missile defense radars have been successfully targeted and destroyed in the (as of today’s date) active conflict, eliminating tracking coverage for entire regions [7][8][9]. These sensors cost hundreds of millions to billions of dollars each. Destroying or degrading them doesn’t just reduce P ( track ) P(\text{track}) P ( track ) — it can eliminate it entirely for the coverage area those radars served. No amount of interceptors can compensate for a tracking pipeline that no longer exists.

This tracking issue also comes up in one of the more pernicious software bugs of all time — the 1991 Patriot missile failure. A cumulative fixed-point truncation error in the system’s clock caused the tracking radar to look in the wrong part of the sky, and the incoming Scud missile was never tracked. Twenty-eight servicemembers were killed. The interceptors were physically capable, but P ( track ) P(\text{track}) P ( track ) was effectively zero.

For now, let’s assume we have great tracking. What happens when the adversary fires more than one missile?

You have I = 7 I = 7 I = 7 interceptors and W = 3 W = 3 W = 3 incoming warheads. We’ll also leave out the P ( track ) P(\text{track}) P ( track ) and consider the idealized case. The warheads have different targets: warhead A A A is headed for a major city, warhead B B B for an airport, and warhead C C C for a military base. How should you allocate your interceptors?

Now let’s scale this up. Assume an inventory of 44 44 44 interceptors and 15 15 15 incoming warheads. Each warhead is aimed at a different city, each with different estimated values, and each interceptor has a different SSPK against each warhead — depending on geometry, timing, and type of interceptor. Then, the number of possible assignments explodes combinatorially.

## Multiple Incoming Missiles

The allocation problem above has a formal name: the Weapon-Target Assignment (WTA) problem.

I I I interceptors (weapons), indexed i = 1 , … , I i = 1, \ldots, I i = 1 , … , I

W W W warheads (targets), indexed j = 1 , … , W j = 1, \ldots, W j = 1 , … , W

A value V j > 0 V_j > 0 V j ​ > 0 for each warhead (the value of the asset that warhead j j j threatens)

An SSPK matrix p i j ∈ [ 0 , 1 ] p_{ij} \in [0, 1] p ij ​ ∈ [ 0 , 1 ] : the probability that interceptor i i i destroys warhead j j j

Decision variables x i j ∈ { 0 , 1 } x_{ij} \in \{0, 1\} x ij ​ ∈ { 0 , 1 } : whether interceptor i i i is assigned to warhead j j j

The objective is to maximize the total expected value of successfully defended assets :

## The Weapon-Target Assignment Problem

(Using ≤ 1 \leq 1 ≤ 1 rather than = 1 = 1 = 1 allows holding interceptors in reserve, which is preferable in multi-wave scenarios or when using a shoot-look-shoot doctrine.)

In essence, for each warhead, the product ∏ i = 1 I ( 1 − p i j ) x i j \prod_{i=1}^{I}(1 - p_{ij})^{x_{ij}} ∏ i = 1 I ​ ( 1 − p ij ​ ) x ij ​ gives the probability that every interceptor assigned to it misses. Taking that product and subtracting it from 1 1 1 gives the probability that at least one interceptor hits (i.e., the warhead is successfully intercepted). Multiply by V j V_j V j ​ to get the expected value saved by defending that target. Sum over all targets, and you want to maximize this total.

Note that a more complete model would multiply each term by P ( track ) j P(\text{track})_j P ( track ) j ​ — the common-mode detection-tracking-classification factor developed in the previous section — but the standard WTA formulation assumes perfect tracking.

In 1986, Lloyd and Witsenhausen proved that the decision version of the WTA problem is NP-complete via reduction from 3-Dimensional Matching [1]. That is, given a threshold T T T , determining whether there exists a feasible assignment with total expected value saved ≥ T \geq T ≥ T is NP-complete. (The corresponding optimization problem is NP-hard.)

Why is this hard? In a linear assignment problem (e.g., assign workers to tasks to minimize total cost), the value of each assignment is independent of every other — the cost of assigning worker i i i to task j j j doesn’t change based on other assignments. Despite having n ! n! n ! feasible solutions, this structure allows polynomial-time algorithms such as the Hungarian algorithm. WTA breaks this property. The product terms in the objective mean that the marginal value of assigning an additional interceptor to a target depends on how many are already assigned there — there are diminishing returns. This couples all assignments together: you cannot evaluate one assignment without knowing the rest. This nonlinearity destroys the decomposition properties that make the linear assignment problem tractable.

And W W W is likely larger than the number of real warheads. A single warhead can deploy many decoys that are difficult to distinguish from real reentry vehicles in the midcourse phase. Wilkening formalizes this with classification probabilities: let P w w P_{ww} P w w ​ be the probability a warhead is correctly classified as a warhead, and P d w P_{dw} P d w ​ be the probability a decoy is mis classified as a warhead [5]. The effective number of targets the defense must engage becomes:

where D D D is the number of decoys. If discrimination is poor ( P d w P_{dw} P d w ​ close to 1.0 1.0 1.0 ), every decoy looks like a warhead. Each undiscriminated decoy is another column in the SSPK matrix, another target in the WTA objective function — it inflates W W W and directly increases the complexity of the allocation problem.

## Discussion

NP-completeness does not mean practically unsolvable. Bertsimas and Paskov (2025) developed a branch-price-and-cut algorithm that solves instances with 10,000 weapons and 10,000 targets to provable optimality in under 7 minutes on a Macbook Pro [10]. Instances with 1,000 targets and 1,500 weapons solve in seconds. The prior state-of-the-art timed out at 2 hours for problems with more than 400 weapons. The computational complexity is not the bottleneck. The bottleneck is that the attacker chooses the problem size — adding a warhead or decoy is cheap, and each one adds another column to the SSPK matrix. Even with an oracle that solves WTA instantly, the defender’s inputs, (i.e., SSPK estimates, tracking probabilities, target values), are uncertain. The “optimal” solution is optimal only with respect to the defender’s imperfect model of the attack.

To recap, let’s plug in the real numbers once more. If you need 4 interceptors per warhead for a 96% chance of interception, then 44 GBIs provide reliable defense against at most 44 4 = 11 \frac{44}{4} = 11 4 44 ​ = 11 ICBMs. That is the entire U.S. ground-based midcourse defense against the ICBM threat. GMD was sized to counter a limited rogue-state threat — not a peer arsenal — but even against that design scenario, the margins are thin. Wilkening’s model makes this starker: defending against a barrage of 20 warheads requires 113 interceptors (at P ( track ) = 0.99 P(\text{track}) = 0.99 P ( track ) = 0.99 , s s p k = 0.70 sspk = 0.70 ss p k = 0.70 ) — far exceeding the current inventory. Even shoot-look-shoot, a much more efficient firing doctrine, requires 47 [5]. An attacker needs only ⌊ I / 4 ⌋ + 1 \lfloor I/4 \rfloor + 1 ⌊ I /4 ⌋ + 1 warheads to ensure at least one faces fewer than 4 interceptors. With the current inventory, that threshold is 12. Add decoys, and things degenerate fast. For example, a barrage of 10 warheads accompanied by just 10 decoys already demands 73 interceptors , with the P ( track ) P(\text{track}) P ( track ) and s s p k sspk ss p k values from above [5].

Directed energy has been proposed as a cost-effective alternative, but introduces its own scheduling constraints — dwell time, platform coverage, atmospheric degradation — with similar scaling issues [4][6].

Finally, it’s important to note this analysis above treats missile defense as a one-sided optimization. In reality, just as the defender solves WTA to maximize expected survival, the attacker solves their own allocation problem — distributing warheads and decoys across targets to minimize the defender’s expected survival. The attacker has structural advantages: they choose the problem size (how many warheads and decoys to deploy), they can observe the defense architecture before committing, and they have the first mover advantage. The defender must prepare for a range of possible attacks; however, the attacker only needs to optimize against the defense that exists.

---

[Orijinal makaleyi oku →](https://smu160.github.io/posts/missile-defense-is-np-complete/) &nbsp;·&nbsp; [Hacker News tartışması →](https://news.ycombinator.com/item?id=47501950)

_Bu içerik otomatik olarak derlenmektedir. Tüm haklar orijinal yayıncıya aittir._