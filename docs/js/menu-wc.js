'use strict';

customElements.define('compodoc-menu', class extends HTMLElement {
    constructor() {
        super();
        this.isNormalMode = this.getAttribute('mode') === 'normal';
    }

    connectedCallback() {
        this.render(this.isNormalMode);
    }

    render(isNormalMode) {
        let tp = lithtml.html(`
        <nav>
            <ul class="list">
                <li class="title">
                    <a href="index.html" data-type="index-link">slot-api documentation</a>
                </li>

                <li class="divider"></li>
                ${ isNormalMode ? `<div id="book-search-input" role="search"><input type="text" placeholder="Type to search"></div>` : '' }
                <li class="chapter">
                    <a data-type="chapter-link" href="index.html"><span class="icon ion-ios-home"></span>Getting started</a>
                    <ul class="links">
                        <li class="link">
                            <a href="overview.html" data-type="chapter-link">
                                <span class="icon ion-ios-keypad"></span>Overview
                            </a>
                        </li>
                        <li class="link">
                            <a href="index.html" data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>README
                            </a>
                        </li>
                                <li class="link">
                                    <a href="dependencies.html" data-type="chapter-link">
                                        <span class="icon ion-ios-list"></span>Dependencies
                                    </a>
                                </li>
                                <li class="link">
                                    <a href="properties.html" data-type="chapter-link">
                                        <span class="icon ion-ios-apps"></span>Properties
                                    </a>
                                </li>
                    </ul>
                </li>
                    <li class="chapter modules">
                        <a data-type="chapter-link" href="modules.html">
                            <div class="menu-toggler linked" data-bs-toggle="collapse" ${ isNormalMode ?
                                'data-bs-target="#modules-links"' : 'data-bs-target="#xs-modules-links"' }>
                                <span class="icon ion-ios-archive"></span>
                                <span class="link-name">Modules</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                        </a>
                        <ul class="links collapse " ${ isNormalMode ? 'id="modules-links"' : 'id="xs-modules-links"' }>
                            <li class="link">
                                <a href="modules/AppModule.html" data-type="entity-link" >AppModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-AppModule-83752d3b2aaa5dc3e6cac2df518c9e98c5105ad97d0d7cf2efa94fc4c85c24902b91f3844a53db402625ffec789e0d98b960320c34f97f084c9c4865798a5ba0"' : 'data-bs-target="#xs-controllers-links-module-AppModule-83752d3b2aaa5dc3e6cac2df518c9e98c5105ad97d0d7cf2efa94fc4c85c24902b91f3844a53db402625ffec789e0d98b960320c34f97f084c9c4865798a5ba0"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-AppModule-83752d3b2aaa5dc3e6cac2df518c9e98c5105ad97d0d7cf2efa94fc4c85c24902b91f3844a53db402625ffec789e0d98b960320c34f97f084c9c4865798a5ba0"' :
                                            'id="xs-controllers-links-module-AppModule-83752d3b2aaa5dc3e6cac2df518c9e98c5105ad97d0d7cf2efa94fc4c85c24902b91f3844a53db402625ffec789e0d98b960320c34f97f084c9c4865798a5ba0"' }>
                                            <li class="link">
                                                <a href="controllers/AppController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AppController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-AppModule-83752d3b2aaa5dc3e6cac2df518c9e98c5105ad97d0d7cf2efa94fc4c85c24902b91f3844a53db402625ffec789e0d98b960320c34f97f084c9c4865798a5ba0"' : 'data-bs-target="#xs-injectables-links-module-AppModule-83752d3b2aaa5dc3e6cac2df518c9e98c5105ad97d0d7cf2efa94fc4c85c24902b91f3844a53db402625ffec789e0d98b960320c34f97f084c9c4865798a5ba0"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-AppModule-83752d3b2aaa5dc3e6cac2df518c9e98c5105ad97d0d7cf2efa94fc4c85c24902b91f3844a53db402625ffec789e0d98b960320c34f97f084c9c4865798a5ba0"' :
                                        'id="xs-injectables-links-module-AppModule-83752d3b2aaa5dc3e6cac2df518c9e98c5105ad97d0d7cf2efa94fc4c85c24902b91f3844a53db402625ffec789e0d98b960320c34f97f084c9c4865798a5ba0"' }>
                                        <li class="link">
                                            <a href="injectables/AppService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AppService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/AuthModule.html" data-type="entity-link" >AuthModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-AuthModule-befe82ccc3ee9972cb139fdfefa7410cf87552b94f6bda58eca49050a76c909877f33874a6ad1d71c6805a2c9cc5b87d2232b382b135d2726e86340b063ffc3a"' : 'data-bs-target="#xs-controllers-links-module-AuthModule-befe82ccc3ee9972cb139fdfefa7410cf87552b94f6bda58eca49050a76c909877f33874a6ad1d71c6805a2c9cc5b87d2232b382b135d2726e86340b063ffc3a"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-AuthModule-befe82ccc3ee9972cb139fdfefa7410cf87552b94f6bda58eca49050a76c909877f33874a6ad1d71c6805a2c9cc5b87d2232b382b135d2726e86340b063ffc3a"' :
                                            'id="xs-controllers-links-module-AuthModule-befe82ccc3ee9972cb139fdfefa7410cf87552b94f6bda58eca49050a76c909877f33874a6ad1d71c6805a2c9cc5b87d2232b382b135d2726e86340b063ffc3a"' }>
                                            <li class="link">
                                                <a href="controllers/AuthController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AuthController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-AuthModule-befe82ccc3ee9972cb139fdfefa7410cf87552b94f6bda58eca49050a76c909877f33874a6ad1d71c6805a2c9cc5b87d2232b382b135d2726e86340b063ffc3a"' : 'data-bs-target="#xs-injectables-links-module-AuthModule-befe82ccc3ee9972cb139fdfefa7410cf87552b94f6bda58eca49050a76c909877f33874a6ad1d71c6805a2c9cc5b87d2232b382b135d2726e86340b063ffc3a"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-AuthModule-befe82ccc3ee9972cb139fdfefa7410cf87552b94f6bda58eca49050a76c909877f33874a6ad1d71c6805a2c9cc5b87d2232b382b135d2726e86340b063ffc3a"' :
                                        'id="xs-injectables-links-module-AuthModule-befe82ccc3ee9972cb139fdfefa7410cf87552b94f6bda58eca49050a76c909877f33874a6ad1d71c6805a2c9cc5b87d2232b382b135d2726e86340b063ffc3a"' }>
                                        <li class="link">
                                            <a href="injectables/AnonymousStrategy.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AnonymousStrategy</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/AuthService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AuthService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/JwtStrategy.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >JwtStrategy</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/LocalStrategy.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >LocalStrategy</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/RoleGuard.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >RoleGuard</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/TokenService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >TokenService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/GoogleModule.html" data-type="entity-link" >GoogleModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-GoogleModule-a7d1824bb5117b2d649dc08fe02b53872171c7f170b2acb87f0efeaadef1000d19263ed509e4c927a4a211aa4debb7834e5740e9599b014f2b7abafbecfb3a17"' : 'data-bs-target="#xs-injectables-links-module-GoogleModule-a7d1824bb5117b2d649dc08fe02b53872171c7f170b2acb87f0efeaadef1000d19263ed509e4c927a4a211aa4debb7834e5740e9599b014f2b7abafbecfb3a17"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-GoogleModule-a7d1824bb5117b2d649dc08fe02b53872171c7f170b2acb87f0efeaadef1000d19263ed509e4c927a4a211aa4debb7834e5740e9599b014f2b7abafbecfb3a17"' :
                                        'id="xs-injectables-links-module-GoogleModule-a7d1824bb5117b2d649dc08fe02b53872171c7f170b2acb87f0efeaadef1000d19263ed509e4c927a4a211aa4debb7834e5740e9599b014f2b7abafbecfb3a17"' }>
                                        <li class="link">
                                            <a href="injectables/GoogleService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >GoogleService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/LoanModule.html" data-type="entity-link" >LoanModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-LoanModule-877466e6cded2a2e46d34accd11033b66ae932105ada21d87c8e29677a1287dacd61176ed927dd01de92fe1e2f5dc9bac80a784d1e24492f6e1aa6fd888b4694"' : 'data-bs-target="#xs-controllers-links-module-LoanModule-877466e6cded2a2e46d34accd11033b66ae932105ada21d87c8e29677a1287dacd61176ed927dd01de92fe1e2f5dc9bac80a784d1e24492f6e1aa6fd888b4694"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-LoanModule-877466e6cded2a2e46d34accd11033b66ae932105ada21d87c8e29677a1287dacd61176ed927dd01de92fe1e2f5dc9bac80a784d1e24492f6e1aa6fd888b4694"' :
                                            'id="xs-controllers-links-module-LoanModule-877466e6cded2a2e46d34accd11033b66ae932105ada21d87c8e29677a1287dacd61176ed927dd01de92fe1e2f5dc9bac80a784d1e24492f6e1aa6fd888b4694"' }>
                                            <li class="link">
                                                <a href="controllers/LoanController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >LoanController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-LoanModule-877466e6cded2a2e46d34accd11033b66ae932105ada21d87c8e29677a1287dacd61176ed927dd01de92fe1e2f5dc9bac80a784d1e24492f6e1aa6fd888b4694"' : 'data-bs-target="#xs-injectables-links-module-LoanModule-877466e6cded2a2e46d34accd11033b66ae932105ada21d87c8e29677a1287dacd61176ed927dd01de92fe1e2f5dc9bac80a784d1e24492f6e1aa6fd888b4694"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-LoanModule-877466e6cded2a2e46d34accd11033b66ae932105ada21d87c8e29677a1287dacd61176ed927dd01de92fe1e2f5dc9bac80a784d1e24492f6e1aa6fd888b4694"' :
                                        'id="xs-injectables-links-module-LoanModule-877466e6cded2a2e46d34accd11033b66ae932105ada21d87c8e29677a1287dacd61176ed927dd01de92fe1e2f5dc9bac80a784d1e24492f6e1aa6fd888b4694"' }>
                                        <li class="link">
                                            <a href="injectables/LoanService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >LoanService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/MailModule.html" data-type="entity-link" >MailModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-MailModule-bc671f8c923a8302263e0a9e5cbee633121b2fb1ecd2dd3ab70fb1636882b33b62da09cb9513ef19a21b31d95e82f5c695cc0faf594b0555608817d968086e32"' : 'data-bs-target="#xs-injectables-links-module-MailModule-bc671f8c923a8302263e0a9e5cbee633121b2fb1ecd2dd3ab70fb1636882b33b62da09cb9513ef19a21b31d95e82f5c695cc0faf594b0555608817d968086e32"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-MailModule-bc671f8c923a8302263e0a9e5cbee633121b2fb1ecd2dd3ab70fb1636882b33b62da09cb9513ef19a21b31d95e82f5c695cc0faf594b0555608817d968086e32"' :
                                        'id="xs-injectables-links-module-MailModule-bc671f8c923a8302263e0a9e5cbee633121b2fb1ecd2dd3ab70fb1636882b33b62da09cb9513ef19a21b31d95e82f5c695cc0faf594b0555608817d968086e32"' }>
                                        <li class="link">
                                            <a href="injectables/MailService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >MailService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/OtpModule.html" data-type="entity-link" >OtpModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-OtpModule-621d701b8fe674df0d3a73bdfff0872481ddde6d5cd90ac5970f6dbfdfb06cf777749c05c270ccbdd749d181529d01f1a2cb5f7a92847d48f19aad15bd3584ac"' : 'data-bs-target="#xs-injectables-links-module-OtpModule-621d701b8fe674df0d3a73bdfff0872481ddde6d5cd90ac5970f6dbfdfb06cf777749c05c270ccbdd749d181529d01f1a2cb5f7a92847d48f19aad15bd3584ac"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-OtpModule-621d701b8fe674df0d3a73bdfff0872481ddde6d5cd90ac5970f6dbfdfb06cf777749c05c270ccbdd749d181529d01f1a2cb5f7a92847d48f19aad15bd3584ac"' :
                                        'id="xs-injectables-links-module-OtpModule-621d701b8fe674df0d3a73bdfff0872481ddde6d5cd90ac5970f6dbfdfb06cf777749c05c270ccbdd749d181529d01f1a2cb5f7a92847d48f19aad15bd3584ac"' }>
                                        <li class="link">
                                            <a href="injectables/OtpService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >OtpService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/RoleModule.html" data-type="entity-link" >RoleModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-RoleModule-daf8fb36f54989a57476780a5008c3462f0b284c851b28fdac2812b222056c9199f82183f9f12830d383df682fd24606e417b519ea39ccd9955703a0e99a9aa5"' : 'data-bs-target="#xs-controllers-links-module-RoleModule-daf8fb36f54989a57476780a5008c3462f0b284c851b28fdac2812b222056c9199f82183f9f12830d383df682fd24606e417b519ea39ccd9955703a0e99a9aa5"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-RoleModule-daf8fb36f54989a57476780a5008c3462f0b284c851b28fdac2812b222056c9199f82183f9f12830d383df682fd24606e417b519ea39ccd9955703a0e99a9aa5"' :
                                            'id="xs-controllers-links-module-RoleModule-daf8fb36f54989a57476780a5008c3462f0b284c851b28fdac2812b222056c9199f82183f9f12830d383df682fd24606e417b519ea39ccd9955703a0e99a9aa5"' }>
                                            <li class="link">
                                                <a href="controllers/RoleController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >RoleController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-RoleModule-daf8fb36f54989a57476780a5008c3462f0b284c851b28fdac2812b222056c9199f82183f9f12830d383df682fd24606e417b519ea39ccd9955703a0e99a9aa5"' : 'data-bs-target="#xs-injectables-links-module-RoleModule-daf8fb36f54989a57476780a5008c3462f0b284c851b28fdac2812b222056c9199f82183f9f12830d383df682fd24606e417b519ea39ccd9955703a0e99a9aa5"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-RoleModule-daf8fb36f54989a57476780a5008c3462f0b284c851b28fdac2812b222056c9199f82183f9f12830d383df682fd24606e417b519ea39ccd9955703a0e99a9aa5"' :
                                        'id="xs-injectables-links-module-RoleModule-daf8fb36f54989a57476780a5008c3462f0b284c851b28fdac2812b222056c9199f82183f9f12830d383df682fd24606e417b519ea39ccd9955703a0e99a9aa5"' }>
                                        <li class="link">
                                            <a href="injectables/RoleService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >RoleService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/SendChampModule.html" data-type="entity-link" >SendChampModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-SendChampModule-800eeb41791ebea26ccbfebf6666fd7df0a75ddec98a37de60d89d0e4030643b3a327985edf0bd79d28397b2c70953fd08169550665767c7540e8ead2761cd06"' : 'data-bs-target="#xs-controllers-links-module-SendChampModule-800eeb41791ebea26ccbfebf6666fd7df0a75ddec98a37de60d89d0e4030643b3a327985edf0bd79d28397b2c70953fd08169550665767c7540e8ead2761cd06"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-SendChampModule-800eeb41791ebea26ccbfebf6666fd7df0a75ddec98a37de60d89d0e4030643b3a327985edf0bd79d28397b2c70953fd08169550665767c7540e8ead2761cd06"' :
                                            'id="xs-controllers-links-module-SendChampModule-800eeb41791ebea26ccbfebf6666fd7df0a75ddec98a37de60d89d0e4030643b3a327985edf0bd79d28397b2c70953fd08169550665767c7540e8ead2761cd06"' }>
                                            <li class="link">
                                                <a href="controllers/SendChampController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >SendChampController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-SendChampModule-800eeb41791ebea26ccbfebf6666fd7df0a75ddec98a37de60d89d0e4030643b3a327985edf0bd79d28397b2c70953fd08169550665767c7540e8ead2761cd06"' : 'data-bs-target="#xs-injectables-links-module-SendChampModule-800eeb41791ebea26ccbfebf6666fd7df0a75ddec98a37de60d89d0e4030643b3a327985edf0bd79d28397b2c70953fd08169550665767c7540e8ead2761cd06"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-SendChampModule-800eeb41791ebea26ccbfebf6666fd7df0a75ddec98a37de60d89d0e4030643b3a327985edf0bd79d28397b2c70953fd08169550665767c7540e8ead2761cd06"' :
                                        'id="xs-injectables-links-module-SendChampModule-800eeb41791ebea26ccbfebf6666fd7df0a75ddec98a37de60d89d0e4030643b3a327985edf0bd79d28397b2c70953fd08169550665767c7540e8ead2761cd06"' }>
                                        <li class="link">
                                            <a href="injectables/SendChampService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >SendChampService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/SmsModule.html" data-type="entity-link" >SmsModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-SmsModule-47358f167d3e83f7aea0627c7ea7f71219d0763520bf9b8e287a76842827733ff20a7a6e7e412b24061bc8ebef10f10a99d34d67348228353a21dbc77670f55e"' : 'data-bs-target="#xs-injectables-links-module-SmsModule-47358f167d3e83f7aea0627c7ea7f71219d0763520bf9b8e287a76842827733ff20a7a6e7e412b24061bc8ebef10f10a99d34d67348228353a21dbc77670f55e"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-SmsModule-47358f167d3e83f7aea0627c7ea7f71219d0763520bf9b8e287a76842827733ff20a7a6e7e412b24061bc8ebef10f10a99d34d67348228353a21dbc77670f55e"' :
                                        'id="xs-injectables-links-module-SmsModule-47358f167d3e83f7aea0627c7ea7f71219d0763520bf9b8e287a76842827733ff20a7a6e7e412b24061bc8ebef10f10a99d34d67348228353a21dbc77670f55e"' }>
                                        <li class="link">
                                            <a href="injectables/SmsService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >SmsService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/TermiiModule.html" data-type="entity-link" >TermiiModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-TermiiModule-02de5f576f585ca9ad8f90c02a22b13819e1bfd217ca97738813b4223e070955e99c7c1beb06a713e0a66d6054997367c7cf15d02fe7ba42dc9595214275cdd7"' : 'data-bs-target="#xs-controllers-links-module-TermiiModule-02de5f576f585ca9ad8f90c02a22b13819e1bfd217ca97738813b4223e070955e99c7c1beb06a713e0a66d6054997367c7cf15d02fe7ba42dc9595214275cdd7"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-TermiiModule-02de5f576f585ca9ad8f90c02a22b13819e1bfd217ca97738813b4223e070955e99c7c1beb06a713e0a66d6054997367c7cf15d02fe7ba42dc9595214275cdd7"' :
                                            'id="xs-controllers-links-module-TermiiModule-02de5f576f585ca9ad8f90c02a22b13819e1bfd217ca97738813b4223e070955e99c7c1beb06a713e0a66d6054997367c7cf15d02fe7ba42dc9595214275cdd7"' }>
                                            <li class="link">
                                                <a href="controllers/TermiiController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >TermiiController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-TermiiModule-02de5f576f585ca9ad8f90c02a22b13819e1bfd217ca97738813b4223e070955e99c7c1beb06a713e0a66d6054997367c7cf15d02fe7ba42dc9595214275cdd7"' : 'data-bs-target="#xs-injectables-links-module-TermiiModule-02de5f576f585ca9ad8f90c02a22b13819e1bfd217ca97738813b4223e070955e99c7c1beb06a713e0a66d6054997367c7cf15d02fe7ba42dc9595214275cdd7"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-TermiiModule-02de5f576f585ca9ad8f90c02a22b13819e1bfd217ca97738813b4223e070955e99c7c1beb06a713e0a66d6054997367c7cf15d02fe7ba42dc9595214275cdd7"' :
                                        'id="xs-injectables-links-module-TermiiModule-02de5f576f585ca9ad8f90c02a22b13819e1bfd217ca97738813b4223e070955e99c7c1beb06a713e0a66d6054997367c7cf15d02fe7ba42dc9595214275cdd7"' }>
                                        <li class="link">
                                            <a href="injectables/TermiiService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >TermiiService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/UserModule.html" data-type="entity-link" >UserModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-UserModule-4bf33b7efc3fd492b1920a495db87281921d8f11a1c6b4b6ad8ba3d24e763c7bab80796665ff1149598ff406ef62a597e917b62b14ccf54eb7b1baac8b171247"' : 'data-bs-target="#xs-controllers-links-module-UserModule-4bf33b7efc3fd492b1920a495db87281921d8f11a1c6b4b6ad8ba3d24e763c7bab80796665ff1149598ff406ef62a597e917b62b14ccf54eb7b1baac8b171247"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-UserModule-4bf33b7efc3fd492b1920a495db87281921d8f11a1c6b4b6ad8ba3d24e763c7bab80796665ff1149598ff406ef62a597e917b62b14ccf54eb7b1baac8b171247"' :
                                            'id="xs-controllers-links-module-UserModule-4bf33b7efc3fd492b1920a495db87281921d8f11a1c6b4b6ad8ba3d24e763c7bab80796665ff1149598ff406ef62a597e917b62b14ccf54eb7b1baac8b171247"' }>
                                            <li class="link">
                                                <a href="controllers/UserController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >UserController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-UserModule-4bf33b7efc3fd492b1920a495db87281921d8f11a1c6b4b6ad8ba3d24e763c7bab80796665ff1149598ff406ef62a597e917b62b14ccf54eb7b1baac8b171247"' : 'data-bs-target="#xs-injectables-links-module-UserModule-4bf33b7efc3fd492b1920a495db87281921d8f11a1c6b4b6ad8ba3d24e763c7bab80796665ff1149598ff406ef62a597e917b62b14ccf54eb7b1baac8b171247"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-UserModule-4bf33b7efc3fd492b1920a495db87281921d8f11a1c6b4b6ad8ba3d24e763c7bab80796665ff1149598ff406ef62a597e917b62b14ccf54eb7b1baac8b171247"' :
                                        'id="xs-injectables-links-module-UserModule-4bf33b7efc3fd492b1920a495db87281921d8f11a1c6b4b6ad8ba3d24e763c7bab80796665ff1149598ff406ef62a597e917b62b14ccf54eb7b1baac8b171247"' }>
                                        <li class="link">
                                            <a href="injectables/UserService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >UserService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                </ul>
                </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#controllers-links"' :
                                'data-bs-target="#xs-controllers-links"' }>
                                <span class="icon ion-md-swap"></span>
                                <span>Controllers</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="controllers-links"' : 'id="xs-controllers-links"' }>
                                <li class="link">
                                    <a href="controllers/AppController.html" data-type="entity-link" >AppController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/AuthController.html" data-type="entity-link" >AuthController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/LoanController.html" data-type="entity-link" >LoanController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/RoleController.html" data-type="entity-link" >RoleController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/SendChampController.html" data-type="entity-link" >SendChampController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/TermiiController.html" data-type="entity-link" >TermiiController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/UserController.html" data-type="entity-link" >UserController</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#classes-links"' :
                            'data-bs-target="#xs-classes-links"' }>
                            <span class="icon ion-ios-paper"></span>
                            <span>Classes</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="classes-links"' : 'id="xs-classes-links"' }>
                            <li class="link">
                                <a href="classes/AccessTokenPayload.html" data-type="entity-link" >AccessTokenPayload</a>
                            </li>
                            <li class="link">
                                <a href="classes/AllExceptionsFilter.html" data-type="entity-link" >AllExceptionsFilter</a>
                            </li>
                            <li class="link">
                                <a href="classes/ApiResponse.html" data-type="entity-link" >ApiResponse</a>
                            </li>
                            <li class="link">
                                <a href="classes/ApiRoute.html" data-type="entity-link" >ApiRoute</a>
                            </li>
                            <li class="link">
                                <a href="classes/ApiRouteDto.html" data-type="entity-link" >ApiRouteDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/AssignRoleDto.html" data-type="entity-link" >AssignRoleDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/AuthPayload.html" data-type="entity-link" >AuthPayload</a>
                            </li>
                            <li class="link">
                                <a href="classes/AuthSuccessResponse.html" data-type="entity-link" >AuthSuccessResponse</a>
                            </li>
                            <li class="link">
                                <a href="classes/ChangePasswordDto.html" data-type="entity-link" >ChangePasswordDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateLoanDto.html" data-type="entity-link" >CreateLoanDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateRoleDto.html" data-type="entity-link" >CreateRoleDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateUserDto.html" data-type="entity-link" >CreateUserDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/DropDownOption.html" data-type="entity-link" >DropDownOption</a>
                            </li>
                            <li class="link">
                                <a href="classes/EmailDto.html" data-type="entity-link" >EmailDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/EnvironmentVariables.html" data-type="entity-link" >EnvironmentVariables</a>
                            </li>
                            <li class="link">
                                <a href="classes/ErrorMessages.html" data-type="entity-link" >ErrorMessages</a>
                            </li>
                            <li class="link">
                                <a href="classes/FieldsMatchConstraint.html" data-type="entity-link" >FieldsMatchConstraint</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetUsersDto.html" data-type="entity-link" >GetUsersDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/GoogleLoginDto.html" data-type="entity-link" >GoogleLoginDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/IApiRoute.html" data-type="entity-link" >IApiRoute</a>
                            </li>
                            <li class="link">
                                <a href="classes/IdDto.html" data-type="entity-link" >IdDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/ILoan.html" data-type="entity-link" >ILoan</a>
                            </li>
                            <li class="link">
                                <a href="classes/IOtp.html" data-type="entity-link" >IOtp</a>
                            </li>
                            <li class="link">
                                <a href="classes/IRole.html" data-type="entity-link" >IRole</a>
                            </li>
                            <li class="link">
                                <a href="classes/IsChannelValueConstraint.html" data-type="entity-link" >IsChannelValueConstraint</a>
                            </li>
                            <li class="link">
                                <a href="classes/IUser.html" data-type="entity-link" >IUser</a>
                            </li>
                            <li class="link">
                                <a href="classes/Loan.html" data-type="entity-link" >Loan</a>
                            </li>
                            <li class="link">
                                <a href="classes/LoginDto.html" data-type="entity-link" >LoginDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/MailOtpDto.html" data-type="entity-link" >MailOtpDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/MessageDto.html" data-type="entity-link" >MessageDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/MobileNumberDto.html" data-type="entity-link" >MobileNumberDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/NotEqualToConstraint.html" data-type="entity-link" >NotEqualToConstraint</a>
                            </li>
                            <li class="link">
                                <a href="classes/Otp.html" data-type="entity-link" >Otp</a>
                            </li>
                            <li class="link">
                                <a href="classes/Pagination.html" data-type="entity-link" >Pagination</a>
                            </li>
                            <li class="link">
                                <a href="classes/PaginationDto.html" data-type="entity-link" >PaginationDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/PaginationMeta.html" data-type="entity-link" >PaginationMeta</a>
                            </li>
                            <li class="link">
                                <a href="classes/PayloadExistsPipe.html" data-type="entity-link" >PayloadExistsPipe</a>
                            </li>
                            <li class="link">
                                <a href="classes/ReadinessCheckResponseDto.html" data-type="entity-link" >ReadinessCheckResponseDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/RefreshToken.html" data-type="entity-link" >RefreshToken</a>
                            </li>
                            <li class="link">
                                <a href="classes/RefreshTokenDto.html" data-type="entity-link" >RefreshTokenDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/RefreshTokenPayload.html" data-type="entity-link" >RefreshTokenPayload</a>
                            </li>
                            <li class="link">
                                <a href="classes/Role.html" data-type="entity-link" >Role</a>
                            </li>
                            <li class="link">
                                <a href="classes/SendOtpDto.html" data-type="entity-link" >SendOtpDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/SetPasswordDto.html" data-type="entity-link" >SetPasswordDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/SuccessMessages.html" data-type="entity-link" >SuccessMessages</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateLoanDto.html" data-type="entity-link" >UpdateLoanDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdatePasswordDto.html" data-type="entity-link" >UpdatePasswordDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateRoleDto.html" data-type="entity-link" >UpdateRoleDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateUserDto.html" data-type="entity-link" >UpdateUserDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/User.html" data-type="entity-link" >User</a>
                            </li>
                            <li class="link">
                                <a href="classes/VerifyOtpDto.html" data-type="entity-link" >VerifyOtpDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/VerifyOtpQueryDto.html" data-type="entity-link" >VerifyOtpQueryDto</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#injectables-links"' :
                                'data-bs-target="#xs-injectables-links"' }>
                                <span class="icon ion-md-arrow-round-down"></span>
                                <span>Injectables</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="injectables-links"' : 'id="xs-injectables-links"' }>
                                <li class="link">
                                    <a href="injectables/AnonymousStrategy.html" data-type="entity-link" >AnonymousStrategy</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/AppService.html" data-type="entity-link" >AppService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/AuthService.html" data-type="entity-link" >AuthService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/CacheService.html" data-type="entity-link" >CacheService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/JwtAuthGuard.html" data-type="entity-link" >JwtAuthGuard</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/JwtStrategy.html" data-type="entity-link" >JwtStrategy</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/LoanService.html" data-type="entity-link" >LoanService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/LocalAuthGuard.html" data-type="entity-link" >LocalAuthGuard</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/LocalStrategy.html" data-type="entity-link" >LocalStrategy</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/LogoutInterceptor.html" data-type="entity-link" >LogoutInterceptor</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/MailService.html" data-type="entity-link" >MailService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/OptionalAuthGuard.html" data-type="entity-link" >OptionalAuthGuard</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/OtpService.html" data-type="entity-link" >OtpService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/Owner.html" data-type="entity-link" >Owner</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ProxyMiddleware.html" data-type="entity-link" >ProxyMiddleware</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/RedirectMiddleware.html" data-type="entity-link" >RedirectMiddleware</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/RoleGuard.html" data-type="entity-link" >RoleGuard</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/RoleService.html" data-type="entity-link" >RoleService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/SmsService.html" data-type="entity-link" >SmsService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/SortQueryConstraint.html" data-type="entity-link" >SortQueryConstraint</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/TermiiService.html" data-type="entity-link" >TermiiService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/TokenService.html" data-type="entity-link" >TokenService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/TransformResponseInterceptor.html" data-type="entity-link" >TransformResponseInterceptor</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/UserService.html" data-type="entity-link" >UserService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ValidIdConstraint.html" data-type="entity-link" >ValidIdConstraint</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ValidMobileNumber.html" data-type="entity-link" >ValidMobileNumber</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#interfaces-links"' :
                            'data-bs-target="#xs-interfaces-links"' }>
                            <span class="icon ion-md-information-circle-outline"></span>
                            <span>Interfaces</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? ' id="interfaces-links"' : 'id="xs-interfaces-links"' }>
                            <li class="link">
                                <a href="interfaces/IRefreshToken.html" data-type="entity-link" >IRefreshToken</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IResponse.html" data-type="entity-link" >IResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/SendChampError.html" data-type="entity-link" >SendChampError</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/SendChampSmsWalletBalance.html" data-type="entity-link" >SendChampSmsWalletBalance</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/SendChampSuccess.html" data-type="entity-link" >SendChampSuccess</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/SendchampWebhookEvent.html" data-type="entity-link" >SendchampWebhookEvent</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/SendMailPayload.html" data-type="entity-link" >SendMailPayload</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/TermiiBalanceSuccess.html" data-type="entity-link" >TermiiBalanceSuccess</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/TermiiSmsSuccess.html" data-type="entity-link" >TermiiSmsSuccess</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/TermiiWebhookEvent.html" data-type="entity-link" >TermiiWebhookEvent</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#miscellaneous-links"'
                            : 'data-bs-target="#xs-miscellaneous-links"' }>
                            <span class="icon ion-ios-cube"></span>
                            <span>Miscellaneous</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="miscellaneous-links"' : 'id="xs-miscellaneous-links"' }>
                            <li class="link">
                                <a href="miscellaneous/enumerations.html" data-type="entity-link">Enums</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/functions.html" data-type="entity-link">Functions</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/typealiases.html" data-type="entity-link">Type aliases</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/variables.html" data-type="entity-link">Variables</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <a data-type="chapter-link" href="coverage.html"><span class="icon ion-ios-stats"></span>Documentation coverage</a>
                    </li>
                    <li class="divider"></li>
                    <li class="copyright">
                        Documentation generated using <a href="https://compodoc.app/" target="_blank" rel="noopener noreferrer">
                            <img data-src="images/compodoc-vectorise.png" class="img-responsive" data-type="compodoc-logo">
                        </a>
                    </li>
            </ul>
        </nav>
        `);
        this.innerHTML = tp.strings;
    }
});