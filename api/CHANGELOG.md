# [1.4.0-rc.4](https://gitlab.com/sibmip/gateway/compare/1.4.0-rc.3...1.4.0-rc.4) (2023-03-12)


### Bug Fixes

* **issue-71:** Logitistic regression cv matrix ([a51616d](https://gitlab.com/sibmip/gateway/commit/a51616d34830a410fc01baae51349435c1777764))
* **issue-72:** Pearson correlation algorithm ([b46f0eb](https://gitlab.com/sibmip/gateway/commit/b46f0ebc77e9c9578c199ee9c2a28b0cb5ec4726))

# [1.4.0-rc.3](https://gitlab.com/sibmip/gateway/compare/1.4.0-rc.2...1.4.0-rc.3) (2023-02-09)


### Bug Fixes

* **Exareme2:** Histograms labels ([fd04921](https://gitlab.com/sibmip/gateway/commit/fd04921e5201a6a944d32dbf214fab3a150f5d20))

# [1.4.0-rc.2](https://gitlab.com/sibmip/gateway/compare/1.4.0-rc.1...1.4.0-rc.2) (2023-02-09)


### Bug Fixes

* **Exareme2:** Fixed histogram enumeration casting ([6f2c26b](https://gitlab.com/sibmip/gateway/commit/6f2c26bd01f548796be097a0ebad41c8cf10535b))
* linter cleanup ([a07ef93](https://gitlab.com/sibmip/gateway/commit/a07ef936f199ecc90d5c8f321b5e09a1d517fd64))

# [1.4.0-rc.1](https://gitlab.com/sibmip/gateway/compare/1.3.0...1.4.0-rc.1) (2023-02-06)


### Bug Fixes

* categories bins ([bf750eb](https://gitlab.com/sibmip/gateway/commit/bf750eba2ade5aba2178c67817f9628e9c8f1c7a))
* cleanup ([edecf44](https://gitlab.com/sibmip/gateway/commit/edecf440a51fcb832f29dd77583a4fae87da989f))
* enabled LR Cross-Validation, Cast numbers -> strings ([bac2951](https://gitlab.com/sibmip/gateway/commit/bac2951f608076e6863a418d62f1d9ab0b27964f))
* **exareme2:** Categorical bins ([bb472ec](https://gitlab.com/sibmip/gateway/commit/bb472ec03aefa788c52d062a8362f3fe80b57a84))
* **exareme2:** debug for histograms ([622d2d7](https://gitlab.com/sibmip/gateway/commit/622d2d7f1bc1d676a423ff6f44e132f6241fc8a4))
* **exareme2:** lint ([8f5bc14](https://gitlab.com/sibmip/gateway/commit/8f5bc1497ef2b13ed490b9defe1db95d468f47f6))
* **exareme2:** test for descriptive stats ([a16b9cd](https://gitlab.com/sibmip/gateway/commit/a16b9cd469262c7137cdb11e7192f06f7746c20d))


### Features

* Histograms handler ([de0c7c2](https://gitlab.com/sibmip/gateway/commit/de0c7c2fbc6379c2f751192a2e41a5377d92f430))
* Logistic Regression handler ([e6eb047](https://gitlab.com/sibmip/gateway/commit/e6eb0474491315adf3e91b3a94a0e1f4d196c20d))

# [1.4.0-beta.2](https://gitlab.com/sibmip/gateway/compare/1.4.0-beta.1...1.4.0-beta.2) (2023-01-17)


### Bug Fixes

* enabled LR Cross-Validation, Cast numbers -> strings ([bac2951](https://gitlab.com/sibmip/gateway/commit/bac2951f608076e6863a418d62f1d9ab0b27964f))

# [1.4.0-beta.1](https://gitlab.com/sibmip/gateway/compare/1.3.0...1.4.0-beta.1) (2023-01-17)


### Bug Fixes

* **exareme2:** test for descriptive stats ([a16b9cd](https://gitlab.com/sibmip/gateway/commit/a16b9cd469262c7137cdb11e7192f06f7746c20d))


### Features

* Logistic Regression handler ([e6eb047](https://gitlab.com/sibmip/gateway/commit/e6eb0474491315adf3e91b3a94a0e1f4d196c20d))

# [1.3.0](https://gitlab.com/sibmip/gateway/compare/1.2.3...1.3.0) (2022-11-22)


### Bug Fixes

* **exareme2:** Descriptive stats error handlings ([9dd1a94](https://gitlab.com/sibmip/gateway/commit/9dd1a94507ca08d10b021bd8cfebacfa8f0a5ffe))


### Features

* **exareme2:** Handler for Exareme 2 Descriptive Stats ([2278f44](https://gitlab.com/sibmip/gateway/commit/2278f44c33709992c193401cc49462c9ae461e26))

## [1.2.3](https://gitlab.com/sibmip/gateway/compare/1.2.2...1.2.3) (2022-10-20)


### Bug Fixes

* **datashield:** Issue with nested labels in descriptive stats ([01adfa3](https://gitlab.com/sibmip/gateway/commit/01adfa33237505031113c6593c2334d650bb25bc))

## [1.2.2](https://gitlab.com/sibmip/gateway/compare/1.2.1...1.2.2) (2022-10-19)


### Bug Fixes

* **Datashield:** issue with jwt ([e5114ef](https://gitlab.com/sibmip/gateway/commit/e5114ef9ae9447fbda7f37c9ccaa2b8d043f44e8))
* **exareme:** Issue with logout response status from portalbackend ([c49a30d](https://gitlab.com/sibmip/gateway/commit/c49a30d921b7cc3a1bcebc0cdbf773c818957645))
* **exareme:** Limit redirection from portalbackend ([e3a11f4](https://gitlab.com/sibmip/gateway/commit/e3a11f42d3fad693a9672f58e4096d4c11343c99))
* **exareme:** Redirect issue with activeUser and domains ([11f0a61](https://gitlab.com/sibmip/gateway/commit/11f0a61164d4926f01aa9d5e9ac16ef16470240b))
* Issue when logging out ([110b31a](https://gitlab.com/sibmip/gateway/commit/110b31ac56675dfbbdc25b02d2d2db4b669ac0d5))
* Issue with Promise activeUser ([ba6e871](https://gitlab.com/sibmip/gateway/commit/ba6e8719106b7a283d898a76105eddfaa7fc1d98))
* Logout was always creating a DB record ([873ea93](https://gitlab.com/sibmip/gateway/commit/873ea9380a01ca7710db876d064492113b6d5587))

## [1.2.2-beta.6](https://gitlab.com/sibmip/gateway/compare/1.2.2-beta.5...1.2.2-beta.6) (2022-10-19)


### Bug Fixes

* Issue with Promise activeUser ([ba6e871](https://gitlab.com/sibmip/gateway/commit/ba6e8719106b7a283d898a76105eddfaa7fc1d98))

## [1.2.2-beta.5](https://gitlab.com/sibmip/gateway/compare/1.2.2-beta.4...1.2.2-beta.5) (2022-10-19)


### Bug Fixes

* **exareme:** Redirect issue with activeUser and domains ([11f0a61](https://gitlab.com/sibmip/gateway/commit/11f0a61164d4926f01aa9d5e9ac16ef16470240b))

## [1.2.2-beta.4](https://gitlab.com/sibmip/gateway/compare/1.2.2-beta.3...1.2.2-beta.4) (2022-10-19)


### Bug Fixes

* **exareme:** Issue with logout response status from portalbackend ([c49a30d](https://gitlab.com/sibmip/gateway/commit/c49a30d921b7cc3a1bcebc0cdbf773c818957645))
* **exareme:** Limit redirection from portalbackend ([e3a11f4](https://gitlab.com/sibmip/gateway/commit/e3a11f42d3fad693a9672f58e4096d4c11343c99))

## [1.2.2-beta.3](https://gitlab.com/sibmip/gateway/compare/1.2.2-beta.2...1.2.2-beta.3) (2022-10-19)


### Bug Fixes

* Issue when logging out ([110b31a](https://gitlab.com/sibmip/gateway/commit/110b31ac56675dfbbdc25b02d2d2db4b669ac0d5))

## [1.2.2-beta.2](https://gitlab.com/sibmip/gateway/compare/1.2.2-beta.1...1.2.2-beta.2) (2022-10-18)


### Bug Fixes

* **Datashield:** issue with jwt ([e5114ef](https://gitlab.com/sibmip/gateway/commit/e5114ef9ae9447fbda7f37c9ccaa2b8d043f44e8))

## [1.2.2-beta.1](https://gitlab.com/sibmip/gateway/compare/1.2.1...1.2.2-beta.1) (2022-10-11)


### Bug Fixes

* Logout was always creating a DB record ([873ea93](https://gitlab.com/sibmip/gateway/commit/873ea9380a01ca7710db876d064492113b6d5587))

## [1.2.1](https://gitlab.com/sibmip/gateway/compare/1.2.0...1.2.1) (2022-09-28)


### Bug Fixes

* **exareme2:** T-test indep was disabled ([f90d91d](https://gitlab.com/sibmip/gateway/commit/f90d91d80d36bf69f322e63cfde7cc61e155f0b8))

# [1.2.0](https://gitlab.com/sibmip/gateway/compare/1.1.0...1.2.0) (2022-09-28)


### Features

* **exareme2:** T-test independent integration ([9893173](https://gitlab.com/sibmip/gateway/commit/98931734674eb0d66613cb27283e67dc207280ab))

# [1.1.0](https://gitlab.com/sibmip/gateway/compare/1.0.2...1.1.0) (2022-09-26)


### Bug Fixes

* Add datasets to groups and variables ([cd3b09d](https://gitlab.com/sibmip/gateway/commit/cd3b09db950c7ef517cc42dbb359a9995ab88c61))
* Add errors catcher for external API calls ([b394bf0](https://gitlab.com/sibmip/gateway/commit/b394bf011f605715bf04e532f32d246cb0989081))
* Add LICENSE file ([dc24614](https://gitlab.com/sibmip/gateway/commit/dc246147ef9dddf6de537029eedfe03db50304d0))
* Add summary table to linear regression ([ca5a723](https://gitlab.com/sibmip/gateway/commit/ca5a72332a7872291f2cdd088709d62c606ff1b2))
* Algorithm parameter value type is now string ([cd8545c](https://gitlab.com/sibmip/gateway/commit/cd8545cb1a4452843b028a50a4c25e1a3f36278c))
* **assets:** Retrieve protocol url behind proxy ([35cdb10](https://gitlab.com/sibmip/gateway/commit/35cdb10345e2ed2198474ad4cfcbb06c9c5504cc))
* Axios and node mismatch type on headers ([f641296](https://gitlab.com/sibmip/gateway/commit/f641296da3a3b100910c08542bbc6b0c659451ac))
* Catch convert problem jsonata (datashield) ([11dda61](https://gitlab.com/sibmip/gateway/commit/11dda61b41198e7e40d0f86f177eacb1a79da61d))
* Catch convert problem jsonata (exareme) ([c330b3f](https://gitlab.com/sibmip/gateway/commit/c330b3fb176c6038e3b5425c99d49b3a099026a3))
* Change status path name ([9857f06](https://gitlab.com/sibmip/gateway/commit/9857f06ce383c759a0ae148a37381bedc0e58f70))
* **csv:** Root variables not added ([7f8f76d](https://gitlab.com/sibmip/gateway/commit/7f8f76d284123e8e347cdf8f195d473f40a04f8d))
* Datashield variables transformation update ([173b4ce](https://gitlab.com/sibmip/gateway/commit/173b4ce061a2c908b983a4694f4348b05a6b0d40))
* **datashield:** Fix issue with types after merge conflict ([378c4fc](https://gitlab.com/sibmip/gateway/commit/378c4fc19f8f40a9ee9ffcbb703b2e7134315a7f))
* **datashield:** Issue with table style ([95b6dc8](https://gitlab.com/sibmip/gateway/commit/95b6dc83145668243d010784eee6ce7273822a3a))
* Define specific Postgres version ([57093ed](https://gitlab.com/sibmip/gateway/commit/57093ed8e9e7a4fb0d2e2a48b7ff0f172fae8b97))
* Devops: docker push to hbpmip repo ([cb287dc](https://gitlab.com/sibmip/gateway/commit/cb287dc1422b3de382976c4675c24b4fecd97910))
* Engine interface login return parameters ([11f5a7d](https://gitlab.com/sibmip/gateway/commit/11f5a7d3de22f7d63bdc4e6798eea2a4a4ed1d94))
* ESLint no-unused-vars false positive issue ([80ca037](https://gitlab.com/sibmip/gateway/commit/80ca0376554ea6434395999101db60a89a062c77))
* **exareme2:** Anova labels and round numbers ([1192214](https://gitlab.com/sibmip/gateway/commit/11922141d141faec136c7b73c93a472e98e1e4a9))
* **exareme2:** Fix pearson next call missing property ([19fe3e2](https://gitlab.com/sibmip/gateway/commit/19fe3e2c98dcab613b357c0ea00149eef0724c1c))
* **exareme2:** Issue with Anova handling condition ([2195136](https://gitlab.com/sibmip/gateway/commit/2195136bb9a3dfcef4f906f361e7f88ed6b51507))
* **exareme2:** Issue with Logistic regression (exareme) ([d993da8](https://gitlab.com/sibmip/gateway/commit/d993da855ddc0cf22344a48e414224811f01376a))
* **exareme2:** Issue with paired t-test ([e8f84b7](https://gitlab.com/sibmip/gateway/commit/e8f84b7648986914e387f5969f30213435210dcc))
* **exareme2:** Pearson add table, remove heatmap ([c30a041](https://gitlab.com/sibmip/gateway/commit/c30a04118eeed70ff930042f7913d554d4d7bf48))
* **exareme2:** Remove fix on pathology id (version) ([7e9dab9](https://gitlab.com/sibmip/gateway/commit/7e9dab9086f25880263cb26e75571dbf0cea9f54))
* **exareme:** Descriptive issue with var and coVar ([beaac84](https://gitlab.com/sibmip/gateway/commit/beaac84bf693ad9b2cd16f683b6b26a8bdc59290))
* **exareme:** Headers empty, catch parsing errors ([a98b658](https://gitlab.com/sibmip/gateway/commit/a98b65813f3992b7e5cf775733a11de92b850166))
* **exareme:** Issue user update result transform ([c761b05](https://gitlab.com/sibmip/gateway/commit/c761b0554b411fe266af9dfc4d1ee23a155c4cc5))
* **exareme:** Issue with Cart and Id3 results ([b663faf](https://gitlab.com/sibmip/gateway/commit/b663faf82e45f88da043cb2e748c933e3ee7dfa9))
* **exareme:** Matrix order in PCA Algorithm result ([b83acde](https://gitlab.com/sibmip/gateway/commit/b83acde8c75c98ed0c4cea0d79b0df5f2e12cb45))
* **exareme:** Reverse matrix order on Heatmap ([89aa7fd](https://gitlab.com/sibmip/gateway/commit/89aa7fdad7424b381592999ed2d49f15cf4fe9f9))
* **exareme:** Swap tab order in linear reg handler ([4e62ebc](https://gitlab.com/sibmip/gateway/commit/4e62ebc5a815b74272da2eceddc692793c17d670))
* **exareme:** Swap tab order logistic reg ([e3697b9](https://gitlab.com/sibmip/gateway/commit/e3697b92beee38b5119868b9317c8ef6bb2d9537))
* Exclude from tests input and model files ([b5c6653](https://gitlab.com/sibmip/gateway/commit/b5c665396abdde82631e4c296bd5952af756c3b5))
* Group id fix for csv connector ([01ccfbc](https://gitlab.com/sibmip/gateway/commit/01ccfbcc56f5e402d938bcb19f4db6c5c6e89e8b))
* Handle parameters exceptions (exareme) ([ee65a87](https://gitlab.com/sibmip/gateway/commit/ee65a872f8cac1d2145bab9840155d1460a1dafe))
* Issue runexperiment sticks in pending ([278be39](https://gitlab.com/sibmip/gateway/commit/278be393bbaf5638a8e492921c09738daa83b0e2))
* Issue throwing connector's errors ([ebb7cf6](https://gitlab.com/sibmip/gateway/commit/ebb7cf6732882598e2cfa56b73bc2e358b662d7a))
* Issue update user return old user data ([c1314ee](https://gitlab.com/sibmip/gateway/commit/c1314ee5fea02ba62df49836dd35778361bf1953))
* Issue with 'has' function in engine service ([acf0ee1](https://gitlab.com/sibmip/gateway/commit/acf0ee15a3f1d51531ca046e1480f73994eccc10))
* Issue with algorithm cache key ([b1c8eb3](https://gitlab.com/sibmip/gateway/commit/b1c8eb3a03911f9447b9d04c173b41bce932e29b))
* Issue with package-lock.json after rebase ([5c6b251](https://gitlab.com/sibmip/gateway/commit/5c6b251736a0f53924bd696364887f233e3c646e))
* Issue with tests (exareme algorithms) ([afebfb9](https://gitlab.com/sibmip/gateway/commit/afebfb962b7380dc11582eaa41808224f9a96aa5))
* Logout issue when user can not be retrieve ([1bc2892](https://gitlab.com/sibmip/gateway/commit/1bc28929c6e880a5b05a885c6dfe35b909170118))
* Method FindOne is replaced by FindOneBy ([79bb095](https://gitlab.com/sibmip/gateway/commit/79bb0953bd960780d124c8add4c9239eef161c60))
* Mispelling and exareme2 result's schema change ([d6d9d58](https://gitlab.com/sibmip/gateway/commit/d6d9d580e15e058a847d055db4280785d80eb163))
* Missing algorithm in list ([9fed5bc](https://gitlab.com/sibmip/gateway/commit/9fed5bc6647ab6a3fb54cfeee7cfe3c821c7a543))
* Missing assets folder in dockerfile ([15238b5](https://gitlab.com/sibmip/gateway/commit/15238b5ef4ae8cdbe99390c06df0ded5a5d1ae53))
* Parameters formula & transfo now optionals ([af4a74a](https://gitlab.com/sibmip/gateway/commit/af4a74ac3b6f60419fde32677ace80d36fdd5352))
* Prevent error on empty experiment's filter value ([21d14c6](https://gitlab.com/sibmip/gateway/commit/21d14c658428d6d46ed3eb467bf9d21231fa3394))
* Prevent local file inclusion exploit ([6f14b65](https://gitlab.com/sibmip/gateway/commit/6f14b653a570ae58c1c6c8a807caa685bddb0774))
* Remove 'v' from tag format ([20b3194](https://gitlab.com/sibmip/gateway/commit/20b3194af563d4416e2dab1b7973c2f703bc0e3a))
* Remove license from readme ([5e024d3](https://gitlab.com/sibmip/gateway/commit/5e024d3f0f7fb9c502d1d5f715b3a6c389ec0666))
* Remove Ontology and datacatalogue urls ([560f3d6](https://gitlab.com/sibmip/gateway/commit/560f3d6e25631c043cf56d88472f7e648035be5f))
* Remove unused readme ([33fcbaa](https://gitlab.com/sibmip/gateway/commit/33fcbaaa3dc558835ca1969d8b39e2d61336e292))
* Remove unused status ([e122b46](https://gitlab.com/sibmip/gateway/commit/e122b46527c13d45aa0b9539b6d3f56b65f5b9ac))
* semantic release workflow ([5820e1b](https://gitlab.com/sibmip/gateway/commit/5820e1ba748ae8aeca1156c26656f1bcea0fbfa8))
* Testing configuration (jest) wrong place ([1a51e02](https://gitlab.com/sibmip/gateway/commit/1a51e02f666ef8cceb8f723df1165531b0b1ae34))
* Transformation issue when array instead of single value ([531ec01](https://gitlab.com/sibmip/gateway/commit/531ec01a8c49c3f6af52ac7f2018ef13fe09ff31))
* Typeorm issue with entity name (user) ([74dd87e](https://gitlab.com/sibmip/gateway/commit/74dd87ec608a3a0790af64892c6a0749c138689b))
* **typeorm:** Config issue after Typeorm update ([b2a76fc](https://gitlab.com/sibmip/gateway/commit/b2a76fc6dccefb41fdd74da2a72097d75514819e))
* Typo in matomo configuration file ([ad573ec](https://gitlab.com/sibmip/gateway/commit/ad573ec67a88148158457d03659f84aebbdb16bc))
* Update dockerfile with new node version ([183aca9](https://gitlab.com/sibmip/gateway/commit/183aca978a5814a8b3caded536a3262c0cc6ffd2))
* User automatically extended in the request  ([5050798](https://gitlab.com/sibmip/gateway/commit/5050798e4da49b5ab883fee43a765e47723ebda3))
* User's cache reset after logout ([1dc6ba8](https://gitlab.com/sibmip/gateway/commit/1dc6ba86c86d238f36ab4390c58a8af082542be4))
* wrong docker image name in ci ([6fd73b6](https://gitlab.com/sibmip/gateway/commit/6fd73b690ade2f49e4a7cd08cc74eb7315140d3c))


### Features

* Add algorithm workflow (galaxy) exception ([da6bd2f](https://gitlab.com/sibmip/gateway/commit/da6bd2f68a51d76519265768d0807168c0250b29))
* Add auth module to manage external login ([df7d7f1](https://gitlab.com/sibmip/gateway/commit/df7d7f160e3c9dc39fbfca066c95d3cf4f9b14b0))
* Add branding and configuration for connectors ([08d8a53](https://gitlab.com/sibmip/gateway/commit/08d8a53fbc884e25b144d2f544836a4e67ea8232))
* Add connector logs with HttpService Module ([bdc445e](https://gitlab.com/sibmip/gateway/commit/bdc445e7b089dd74b1fa4dcf957651349737ef34))
* Add documentation to the project repo ([3ad9f7b](https://gitlab.com/sibmip/gateway/commit/3ad9f7b95951bd57d862c195d81cfaa2bea13e05))
* Add formula into experiment model ([46aa7d1](https://gitlab.com/sibmip/gateway/commit/46aa7d1216706dfeece085344e6b3de3ba53b08b))
* Add formula transform experiment (exareme) ([58d5a14](https://gitlab.com/sibmip/gateway/commit/58d5a14dee1d41805b4ffc27e50aa5165cfbe036))
* Add LICENSE ([4a8876b](https://gitlab.com/sibmip/gateway/commit/4a8876b006562b2f2515c712bedd1ff10b7b085e))
* add longitudinal info on datasets ([bafbb7d](https://gitlab.com/sibmip/gateway/commit/bafbb7df5a25494781ee5c73a24ba31c39b2003c))
* Add optional filter and formula ([c96b6fd](https://gitlab.com/sibmip/gateway/commit/c96b6fd7f7c99fb2fe1d4b9eace5b256d8ed23c2))
* Add release process in gitlab pipeline ([f9dd6b6](https://gitlab.com/sibmip/gateway/commit/f9dd6b643770e70d3adb44b54a611d5db9bf74a6))
* Add secret JWT token to Gitlab CI ([ce8caee](https://gitlab.com/sibmip/gateway/commit/ce8caeebd1e901067819f1feb28698643b36923a))
* Add semantic backmerge for GitFlow compatibility ([6c9491d](https://gitlab.com/sibmip/gateway/commit/6c9491dab59cc707216f5f9eac839d1ad672a975))
* Add Semantic Release ([ef59b3e](https://gitlab.com/sibmip/gateway/commit/ef59b3eec78e93ca9df88f17c4c5b87e235d3fde))
* Add semantic-release ([cee1e25](https://gitlab.com/sibmip/gateway/commit/cee1e251f8508af78d42416d5958920403097a0f))
* Added configurable log levels ([873d9fc](https://gitlab.com/sibmip/gateway/commit/873d9fcee3bf0c17c471ab2b762496b79d0a4ee7))
* Algorithms support through GraphQL ([58c9214](https://gitlab.com/sibmip/gateway/commit/58c92148e8bd4d15956236cfcded66d292c58897))
* Allow both user update (gateway and engine) ([8ccef49](https://gitlab.com/sibmip/gateway/commit/8ccef49088effe6b6b5a5e8a0c63e30a7dfc2f1a))
* datashield domain (datasets) integration ([cc58c20](https://gitlab.com/sibmip/gateway/commit/cc58c200137cd802cddda52d64997535cfe17c33))
* **datashield:** Add datasets filter on histogram and quantiles ([4a35910](https://gitlab.com/sibmip/gateway/commit/4a35910dbd42f46aac8864db5aa3730514a8e761))
* **datashield:** Add logout ([d8f77d4](https://gitlab.com/sibmip/gateway/commit/d8f77d4cfeccbe8e0f68f45f87c0550382b9caaa))
* **datashield:** Descriptive algorithm integration ([bbae397](https://gitlab.com/sibmip/gateway/commit/bbae397b76a8849fb00d957f3b2dc8048f7a2dac))
* **datashield:** Linear regression integration ([077e656](https://gitlab.com/sibmip/gateway/commit/077e656bd50900e8918e2a460bf6749a64eebadb))
* **datashield:** Update domains input ([adce943](https://gitlab.com/sibmip/gateway/commit/adce943abf1a7c02624079580f5fc0442259fdda))
* **exareme2:** Add linear regression handler ([c0c6528](https://gitlab.com/sibmip/gateway/commit/c0c6528558ab039bd3cccbe7110aa58f3cde915a))
* **exareme2:** Logistic regression CV integration ([b7da1f3](https://gitlab.com/sibmip/gateway/commit/b7da1f38d0d5980b158ec3ccfedf9fdec2260c13))
* **exareme2:** T-test one sample integration ([395ea4a](https://gitlab.com/sibmip/gateway/commit/395ea4a0cce08bb9bec35fe44c9cc06f4d50992d))
* **exareme2:** Ttest onesample and paired integration ([12b9afd](https://gitlab.com/sibmip/gateway/commit/12b9afda4164b4f4a2774097b05f51ad63033d34))
* **exareme:** Add Anova one way integration ([a0b945b](https://gitlab.com/sibmip/gateway/commit/a0b945b4505452d09774ddc3c0096b12cf1e6e83))
* **exareme:** Add Pearson viz integration ([de5f849](https://gitlab.com/sibmip/gateway/commit/de5f849ff5afd3149341decaf26567b2624966b2))
* **exareme:** Integration & test for PCA Algorithm (viz) ([a78977b](https://gitlab.com/sibmip/gateway/commit/a78977ba94b4e53f677f60d0ec23587097a4026d))
* **exareme:** Integration exareme2 ([fcce48a](https://gitlab.com/sibmip/gateway/commit/fcce48a9a200119e2948bc93f015988401390c50))
* **exareme:** Integration of Ttest paired ([8595556](https://gitlab.com/sibmip/gateway/commit/8595556ec64f60c053d05f7d417d8443661c3bb8))
* **exareme:** Linear Regression (CV) integrated ([d46ce3e](https://gitlab.com/sibmip/gateway/commit/d46ce3e797e64ccb60823269a5a18677c106df0b))
* **exareme:** Logistic regression integration ([2bc8631](https://gitlab.com/sibmip/gateway/commit/2bc86316d4337c520f8038cbfef54326162509c0))
* **exareme:** Terms of Service update ([30e9845](https://gitlab.com/sibmip/gateway/commit/30e9845833f8e2a10cfb262cb38dc4a649c1bbf6))
* **exareme:** Update Terms of Service ([f314826](https://gitlab.com/sibmip/gateway/commit/f31482625d03b73943595a16118aa48ce6e5d133))
* **GrahpQL:** Filter and formula fields available ([f7d14cb](https://gitlab.com/sibmip/gateway/commit/f7d14cb944e9f95d0a7b7f63794933689c103389))
* Line chart viz integration ([f1092fe](https://gitlab.com/sibmip/gateway/commit/f1092fede014866416dcb7d9e85a41a14682e8e4))
* Logisitc regression integration ([743b6d0](https://gitlab.com/sibmip/gateway/commit/743b6d01d876076af7ff87d2f4b3a92de088484f))
* Matomo integration ([574e666](https://gitlab.com/sibmip/gateway/commit/574e666d64f46917ada338b8cac3a355ce5070d9))
* New result type 'AlertResult' ([cc2a3b4](https://gitlab.com/sibmip/gateway/commit/cc2a3b4cfeaeaa97d9262b192c59ed81bd9579ca))
* Possibility to save experiments locally ([d689bb5](https://gitlab.com/sibmip/gateway/commit/d689bb5e5a9579488f53c03e11a7ae263267241e))
* Refresh Auth token endpoint in GraphQL ([5422d76](https://gitlab.com/sibmip/gateway/commit/5422d7651dc4cb3b82b2bf1223a7797ea46e48a6))
* Remove Matomo configuration ([9206e75](https://gitlab.com/sibmip/gateway/commit/9206e75137a1cf12d6b1f03a6330b32cf5ae6111))
* Update Apollo server to last version ([868c72c](https://gitlab.com/sibmip/gateway/commit/868c72c64c8976ae7addb1ae781c0160392278da))
* Update dependencies ([311a0a8](https://gitlab.com/sibmip/gateway/commit/311a0a86a08b56ed171f6de008160e7fd73427d6))
* Updated nestjs GraphQL dependency ([5e45304](https://gitlab.com/sibmip/gateway/commit/5e453040c1db5b00ac236ea61b06a5e4f754e232))
