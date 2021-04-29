task("euler", "Interact with Euler contract")
    .addPositionalParam("designator", "contract.function")
    .addOptionalVariadicPositionalParam("args")
    .addFlag("callstatic")
    .setAction(async ({ designator, args, callstatic, }) => {
        const et = require("../test/lib/eTestLib");
        const ctx = await et.getTaskCtx();

        let components = designator.split('.');
        let contract = ctx.contracts;
        while (components.length > 1) contract = contract[components.shift()];
        let functionName = components[0];

        let fragment = contract.interface.fragments.find(f => f.name === functionName);
        if (!fragment) throw(`no such function found: ${functionName}`);

        args = args.map(a => {
            if (a === 'me') return ctx.wallet.address;
            if (parseInt(a)+'' === a) return ethers.BigNumber.from(a);
            return a;
        });

        let res;

        try {
            if (fragment.constant) {
                res = await contract[functionName].apply(null, args);
            } else if (callstatic) {
                res = await contract.callStatic[functionName].apply(null, args);
            } else {
                let tx = await contract.functions[functionName].apply(null, args);
                console.log(`tx: ${tx.hash}`);
                res = await tx.wait();
            }
        } catch (e) {
            console.error("ERROR");
            console.error(e.error);
            process.exit(1);
        }

        console.log(res);

});